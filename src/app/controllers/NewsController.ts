import { Request } from 'express'
import { getRepository } from 'typeorm'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useObjectValidation } from '@hooks/useObjectValidation'
import { usePaginator } from '@hooks/usePaginator'
import { useResponseBuilder } from '@hooks/useResponseBuilder'
import { useSearchParams } from '@hooks/useSearchParams'
import { AutoBindClass } from '@interfaces/AutoBind'
import { AppControllerProps, NewResponse } from '@interfaces/Controller'
import { News } from '@models/News'
import { ProductImage } from '@models/ProductImage'
import { makeSchemaFieldsOptional } from '@utils/makeSchemaFieldsOptional'

import { DefinePermissions } from '../decorators/DefinePermissions'
import { NewsObjectSchema } from '../schemas/NewsSchema'

class NewsControllerClass extends AutoBindClass implements AppControllerProps {
  @DefinePermissions('ADD_NEWS')
  async create (req: Request, res: NewResponse) {
    const {
      $isError,
      product_image,
      ...body
    } = await useObjectValidation(req.body, NewsObjectSchema)

    if ($isError) {
      return useErrorMessage('invalid fields', 400, res, {
        fields: { ...body, product_image }
      })
    }

    const productImageRepository = getRepository(ProductImage)

    const findedProductImage = await productImageRepository.findOne(product_image)

    if (!findedProductImage) {
      return useErrorMessage('product image does not exists', 400, res)
    }

    const newsRepository = getRepository(News)

    const mainNewsCount = await newsRepository.count({
      where: {
        isMain: true
      }
    })

    const insertedNews = await newsRepository.save({
      ...body,
      actionText: body.action_text,
      actionUrl: body.action_url,
      isMain: mainNewsCount < 3 ? true : body.is_main,
      productImage: findedProductImage
    })

    return res.status(201).json(insertedNews)
  }

  @DefinePermissions('EDIT_NEWS')
  async update (req: Request, res: NewResponse) {
    const { newsId } = req.params
    const {
      $isError,
      product_image,
      is_main,
      ...body
    } = await useObjectValidation(req.body, {
      ...NewsObjectSchema,
      YupSchema: makeSchemaFieldsOptional(NewsObjectSchema.YupSchema)
    })

    if ($isError) {
      return useErrorMessage('invalid fields', 400, res, {
        fields: { ...body, product_image }
      })
    }

    const newsRepository = getRepository(News)

    const findedNews = await newsRepository.findOne(newsId, {
      relations: ['productImage']
    })

    if (!findedNews) {
      return useErrorMessage('news does not exists', 400, res)
    }

    if (product_image) {
      const productImageRepository = getRepository(ProductImage)

      const findedProductImage = await productImageRepository.findOne(product_image)

      if (!findedProductImage) {
        return useErrorMessage('product image does not exists', 400, res)
      }

      findedNews.productImage = findedProductImage
    }

    if (is_main) {
      const mainNewsCount = await newsRepository.count({
        where: {
          isMain: true
        }
      })

      findedNews.isMain = mainNewsCount < 3 ? true : is_main
    }

    const updatedNewsResult = await newsRepository.save({
      ...findedNews,
      ...body
    })

    return res
      .status(200)
      .json(updatedNewsResult)
  }

  @DefinePermissions('REMOVE_NEWS')
  async remove (req: Request, res: NewResponse) {
    const { newsId } = req.params

    const newsRepository = getRepository(News)

    const findedNews = await newsRepository.findOne(newsId)

    if (!findedNews) {
      return useErrorMessage('news does not exists', 400, res)
    }

    const removeResult = await newsRepository.remove([findedNews])

    if (removeResult) {
      return res.sendStatus(200)
    }

    return useErrorMessage('it was not possible to remove this news', 500, res)
  }

  @DefinePermissions('LIST_NEWS')
  async listAll (req: Request, res: NewResponse) {
    const newsRepository = getRepository(News)

    const paginator = usePaginator(req.query)
    const searchParams = useSearchParams(req.query,
      newsRepository,
      ['id', 'productImage', 'createdAt']
    )

    const news = await newsRepository.find({
      ...paginator,
      where: searchParams,
      relations: ['productImage']
    })

    const buildedResponse = await useResponseBuilder(
      news,
      paginator,
      searchParams,
      newsRepository
    )

    return res.json(buildedResponse)
  }

  async index (_req: Request, res: NewResponse) {
    const newsRepository = getRepository(News)

    const news = await newsRepository.find({
      where: {
        isMain: true
      },
      relations: ['productImage']
    })

    return res.json(news)
  }
}

export const NewsController = new NewsControllerClass()
