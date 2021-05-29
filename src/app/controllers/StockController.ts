import { Request } from 'express'
import { getRepository } from 'typeorm'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useObjectValidation } from '@hooks/useObjectValidation'
import { usePaginator } from '@hooks/usePaginator'
import { useResponseBuilder } from '@hooks/useResponseBuilder'
import { useSearchParams } from '@hooks/useSearchParams'
import { AutoBindClass } from '@interfaces/AutoBind'
import { AppControllerProps, NewResponse } from '@interfaces/Controller'
import { Product } from '@models/Product'
import { Stock } from '@models/Stock'

import { DefinePermissions } from '../decorators/DefinePermissions'
import { StockObjectSchema } from '../schemas/StockSchema'

class StockControllerClass extends AutoBindClass implements AppControllerProps {
  @DefinePermissions('ADD_STOCK')
  async create (req: Request, res: NewResponse) {
    const { productId: product_id } = req.params
    const { units, $isError } = await useObjectValidation(req.body, StockObjectSchema)

    if ($isError) {
      return useErrorMessage('invalid fields', 400, res, {
        fields: { units }
      })
    }

    const productRepository = getRepository(Product)

    const findedProduct = await productRepository.findOne(product_id, {
      select: ['id']
    })

    if (!findedProduct) {
      return useErrorMessage('product not found', 400, res)
    }

    const stockRepository = getRepository(Stock)

    if (units < 0) {
      const atualProductUnits = await stockRepository.createQueryBuilder('stock')
        .select('SUM(stock.units)', 'quantity')
        .where('stock.product_id = :productId', { productId: product_id })
        .getRawOne()

      if (!atualProductUnits || atualProductUnits.quantity < units) {
        return useErrorMessage('insuficient product units', 400, res)
      }
    }

    const insertResult = await stockRepository.save({
      product: findedProduct,
      registeredBy: res.locals.user,
      units
    })

    delete insertResult.product
    delete insertResult.registeredBy

    return res.status(201).json(insertResult)
  }

  @DefinePermissions('LIST_STOCKS')
  async index (req: Request, res: NewResponse) {
    const stockRepository = getRepository(Stock)

    const paginator = usePaginator(req.query)
    const searchParams = useSearchParams(
      req.query,
      stockRepository,
      ['id', 'units', 'registeredBy']
    )

    const stocks = await stockRepository.find({
      ...paginator,
      where: searchParams,
      relations: ['product']
    })

    const buildedResponse = await useResponseBuilder(
      stocks,
      paginator,
      searchParams,
      stockRepository
    )

    return res
      .status(200)
      .json(buildedResponse)
  }

  @DefinePermissions('LIST_STOCKS')
  async listProductStock (req: Request, res: NewResponse) {
    const { productId: product_id } = req.params

    const productRepository = getRepository(Product)

    const findedProduct = await productRepository.findOne(product_id)

    if (!findedProduct) {
      return useErrorMessage('product not found', 400, res)
    }

    const stockRepository = getRepository(Stock)

    const paginator = usePaginator(req.query)
    const searchParams = useSearchParams(
      req.query,
      stockRepository,
      ['id', 'units', 'registeredBy'],
      ['product']
    )

    const stocks = await stockRepository.find({
      ...paginator,
      where: {
        product: findedProduct,
        ...searchParams
      }
    })

    const totalProductUnits = await stockRepository.createQueryBuilder('stock')
      .select('SUM(stock.units)', 'totalProductUnits')
      .where('stock.product_id = :productId', { productId: product_id })
      .getRawOne()

    const buildedResponse = await useResponseBuilder(
      stocks,
      paginator,
      searchParams,
      stockRepository,
      totalProductUnits
    )

    return res
      .status(200)
      .json(buildedResponse)
  }
}

export const StockController = new StockControllerClass()
