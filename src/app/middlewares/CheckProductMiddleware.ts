
import { NextFunction, Request } from 'express'
import { NewResponse } from 'src/@types/Controller'
import { getRepository } from 'typeorm'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { Product } from '@models/Product'

export async function checkProductMiddleware (req: Request, res: NewResponse, next: NextFunction) {
  const { productId } = req.params

  const productRepository = getRepository(Product)

  const product = await productRepository.findOne(productId)

  if (!product) {
    return useErrorMessage('product does not exists', 400, res)
  }

  res.locals.product = product

  next()
  return true
}
