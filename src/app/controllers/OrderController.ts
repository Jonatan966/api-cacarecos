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

import { DefinePermissions, findPermission } from '../decorators/DefinePermissions'
import { OrderObjectSchema } from '../schemas/OrderSchema'
import { StatusObjectSchema } from '../schemas/StatusSchema'

class OrderControllerClass extends AutoBindClass implements AppControllerProps {
  @DefinePermissions('BUY')
  async create (req: Request, res: NewResponse) {
    const { $isError, ...body } = await useObjectValidation(req.body, OrderObjectSchema)

    if ($isError) {
      return useErrorMessage('invalid fields', 400, res, {
        fields: { ...body }
      })
    }

    const productsRepo = getRepository(Product)

    const onlyExistingProducts = await productsRepo.find({
      where: body.products.map(product => ({ id: product.id })),
      select: ['id', 'price', 'units']
    })

    if (onlyExistingProducts.length < body.products.length) {
      const nonExistentProducts = body.products.filter(product =>
        !onlyExistingProducts.find(existingProduct => existingProduct.id === product.id)
      )

      return useErrorMessage('these products do not exist', 400, res, {
        products: nonExistentProducts
      })
    }

    const productsWithInsufficientUnits = body.products.filter(product =>
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

    const orderAmount = body.products.reduce((acc, product) =>
      onlyExistingProducts.find(existingProduct =>
        existingProduct.id === product.id
      ).price * product.units + acc
    , 0)

    const insertedOrder = await orderRepo.save({
      owner: res.locals.user,
      amount: orderAmount
    })

    const orderProductsList = body.products.map(product => ({
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

  @DefinePermissions('BUY')
  async index (req: Request, res: NewResponse) {
    const orderRepo = getRepository(Order)

    const paginator = usePaginator(req.query)
    const customQueryParams = {
      ...req.query
    }

    if (!findPermission(res.locals.user.roles, 'VIEW_ORDERS')) {
      customQueryParams.owner = res.locals.user as any
    } else if (req.query?.owner) {
      customQueryParams.owner = req.query?.owner
    }

    const searchParams = useSearchParams(
      customQueryParams,
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

  @DefinePermissions('BUY')
  async show (req: Request, res: NewResponse) {
    const { id } = req.params
    const orderRepo = getRepository(Order)

    const findCondition = {} as any

    if (!findPermission(res.locals.user.roles, 'VIEW_ORDERS')) {
      findCondition.owner = res.locals.user as any
    }

    const findedOrder = await orderRepo.findOne(id, {
      where: findCondition,
      relations: ['orderProducts']
    })

    if (!findedOrder) {
      return useErrorMessage('order is not found', 400, res)
    }

    return res.json(findedOrder)
  }

  @DefinePermissions('BUY')
  async remove (req: Request, res: NewResponse) {
    const { id: orderId } = req.params

    const orderRepo = getRepository(Order)

    const order = await orderRepo.findOne(orderId, {
      relations: ['owner'],
      where: findPermission(res.locals.user.roles, 'CANCEL_ORDER') ? null : {
        owner: res.locals.user
      }
    })

    if (!order) {
      return useErrorMessage('order not exists', 400, res)
    }

    if (order.status === OrderStatus.Finished) {
      return useErrorMessage('it is not possible to cancel an order that has already been finished', 400, res)
    }

    await orderRepo.update(order.id, { status: OrderStatus.Canceled })

    return res.sendStatus(200)
  }

  @DefinePermissions('UPDATE_ORDER')
  async changeStatus (req: Request, res: NewResponse) {
    const { id: orderId } = req.params
    const { status, $isError } = await useObjectValidation(req.body, StatusObjectSchema)

    if ($isError) {
      return useErrorMessage('invalid fields', 400, res, {
        fields: { status }
      })
    }

    const orderRepo = getRepository(Order)

    const order = await orderRepo.findOne(orderId)

    if (!order) {
      return useErrorMessage('order not exists', 400, res)
    }

    const updateResult = await orderRepo.update(order.id, {
      status: OrderStatus[status],
      finishedBy: OrderStatus[status] === OrderStatus.Finished
        ? res.locals.user
        : order.finishedBy
    })

    if (!updateResult.affected) {
      return useErrorMessage('it was not possible to change the status of this order', 500, res)
    }

    return res.sendStatus(200)
  }
}

export const OrderController = new OrderControllerClass()
