import { Request } from 'express'
import { getRepository } from 'typeorm'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useObjectValidation } from '@hooks/useObjectValidation'
import { usePaginator } from '@hooks/usePaginator'
import { useResponseBuilder } from '@hooks/useResponseBuilder'
import { useSearchParams } from '@hooks/useSearchParams'
import { AppControllerProps, NewResponse } from '@interfaces//Controller'
import { AutoBindClass } from '@interfaces/AutoBind'
import { Order, OrderStatus } from '@models/Order'
import { OrderProduct } from '@models/OrderProduct'
import { Product } from '@models/Product'

import { OrderObjectSchema } from '../schemas/OrderSchema'

class OrderControllerClass extends AutoBindClass implements AppControllerProps {
  async create (req: Request, res: NewResponse) {
    const { products, $isError } = await useObjectValidation(req.body, OrderObjectSchema)

    if ($isError) {
      return useErrorMessage('invalid fields', 400, res, {
        fields: { products }
      })
    }

    const productsRepo = getRepository(Product)

    const onlyExistingProducts = await productsRepo.find({
      where: products.map(product => ({ id: product.id })),
      select: ['id', 'price', 'units']
    })

    if (onlyExistingProducts.length < products.length) {
      const nonExistentProducts = products.filter(product =>
        !onlyExistingProducts.find(existingProduct => existingProduct.id === product.id)
      )

      return useErrorMessage('these products do not exist', 400, res, {
        products: nonExistentProducts
      })
    }

    const productsWithInsufficientUnits = products.filter(product =>
      onlyExistingProducts.find(existingProduct => existingProduct.id === product.id)
        .units < product.units
    )

    if (productsWithInsufficientUnits.length) {
      return useErrorMessage('these products have insufficient units or out of stock', 400, res, {
        products: productsWithInsufficientUnits
      })
    }

    const orderRepo = getRepository(Order)
    const orderProductRepo = getRepository(OrderProduct)

    const orderAmount = products.reduce((acc, product) =>
      onlyExistingProducts.find(existingProduct =>
        existingProduct.id === product.id
      ).price * product.units + acc
    , 0)

    const insertedOrder = await orderRepo.save({
      owner: res.locals.user,
      amount: orderAmount
    })

    const orderProductsList = products.map(product => ({
      order: insertedOrder,
      product: onlyExistingProducts.find(existingProduct => existingProduct.id === product.id),
      units: product.units
    }))

    const insertedOrderProducts = await orderProductRepo.save(orderProductsList)

    if (!insertedOrderProducts.length) {
      return useErrorMessage('unable to enter order', 500, res)
    }

    return res.status(201).json({
      id: insertedOrder.id
    } as any)
  }

  async index (req: Request, res: NewResponse) {
    const orderRepo = getRepository(Order)

    const paginator = usePaginator(req.query)
    const searchParams = useSearchParams(
      req.query,
      orderRepo,
      ['id', 'status', 'amount', 'finishedBy', 'owner'],
      ['orderProducts']
    )

    const orders = await orderRepo.find({
      relations: ['owner'],
      ...paginator,
      where: searchParams
    })

    const buildedResponse = await useResponseBuilder(
      orders,
      paginator,
      searchParams,
      orderRepo
    )

    return res.json(buildedResponse)
  }

  async remove (req: Request, res: NewResponse) {
    const { id: orderId } = req.params

    const orderRepo = getRepository(Order)

    const order = await orderRepo.findOne(orderId, {
      relations: ['owner']
    })

    if (!res.locals.user.roles.some(role => role.name === 'ADMIN')) {
      if (!order || order.owner.id !== res.locals.user.id) {
        return useErrorMessage('order not exists', 400, res)
      }
    }

    if (order.status === OrderStatus.Finished) {
      return useErrorMessage('it is not possible to cancel an order that has already been finished', 400, res)
    }

    order.status = OrderStatus.Canceled

    await orderRepo.update(order.id, { status: order.status })

    return res.sendStatus(200)
  }
}

export const OrderController = new OrderControllerClass()
