import { Request } from 'express'
import { getRepository } from 'typeorm'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { usePaginator } from '@hooks/usePaginator'
import { useResponseBuilder } from '@hooks/useResponseBuilder'
import { useSearchParams } from '@hooks/useSearchParams'
import { AutoBindClass } from '@interfaces/AutoBind'
import { AppControllerProps, NewResponse } from '@interfaces/Controller'
import { Favorite } from '@models/Favorite'
import { Product } from '@models/Product'

import { DefinePermissions } from '../decorators/DefinePermissions'

class FavoriteControllerClass extends AutoBindClass implements AppControllerProps {
  @DefinePermissions('FAVORITE')
  async create (req: Request, res: NewResponse) {
    const { productId } = req.params

    const productRepository = getRepository(Product)

    const existingProduct = await productRepository.findOne(productId)

    if (!existingProduct) {
      return useErrorMessage('product does not exists', 400, res)
    }

    const favoriteRepository = getRepository(Favorite)

    const hasFavorited = await favoriteRepository.findOne({
      where: {
        owner: res.locals.user,
        product: existingProduct
      }
    })

    if (hasFavorited) {
      return useErrorMessage('this product is already in your favorites list', 400, res)
    }

    const favoriteResult = await favoriteRepository.save({
      owner: res.locals.user,
      product: existingProduct
    })

    return res.status(201).json(favoriteResult)
  }

  @DefinePermissions('FAVORITE')
  async remove (req: Request, res: NewResponse) {
    const { productId } = req.params

    const favoriteRepository = getRepository(Favorite)
    const productRepository = getRepository(Product)

    const existingProduct = await productRepository.findOne(productId)

    if (!existingProduct) {
      return useErrorMessage('product does not exists', 400, res)
    }

    const deleteResult = await favoriteRepository.delete({
      product: existingProduct,
      owner: res.locals.user
    })

    if (deleteResult.affected) {
      return res
        .sendStatus(200)
    }

    return useErrorMessage('this product is not on your favorites list', 400, res)
  }

  @DefinePermissions('FAVORITE')
  async index (req: Request, res: NewResponse) {
    const favoriteRepository = getRepository(Favorite)

    const paginator = usePaginator(req.query)
    const searchParams = {
      owner: res.locals.user,
      ...useSearchParams(req.query, favoriteRepository, ['id', 'owner', 'product'])
    }

    const favorites = await favoriteRepository.find({
      ...paginator,
      where: searchParams,
      relations: ['products']
    })

    const buildedResponse = await useResponseBuilder(
      favorites,
      paginator,
      searchParams as any,
      favoriteRepository
    )

    return res.json(buildedResponse)
  }
}

export const FavoriteController = new FavoriteControllerClass()
