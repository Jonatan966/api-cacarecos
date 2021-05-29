
import { Request } from 'express'
import { getRepository } from 'typeorm'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useInsertOnlyNotExists } from '@hooks/useInsertOnlyNotExists'
import { useObjectValidation } from '@hooks/useObjectValidation'
import { usePaginator } from '@hooks/usePaginator'
import { useResponseBuilder } from '@hooks/useResponseBuilder'
import { useSearchParams } from '@hooks/useSearchParams'
import { AppControllerProps, NewResponse } from '@interfaces//Controller'
import { AutoBindClass } from '@interfaces/AutoBind'
import { Rating } from '@models/Rating'

import { DefinePermissions } from '../decorators/DefinePermissions'
import { RatingObjectSchema } from '../schemas/RatingSchema'

class RatingControllerClass extends AutoBindClass implements AppControllerProps {
  @DefinePermissions('ADD_RATING')
  async create (req: Request, res: NewResponse) {
    const { $isError, ...body } = await useObjectValidation(req.body, RatingObjectSchema)

    if ($isError) {
      return useErrorMessage('invalid fields', 400, res, {
        fields: body
      })
    }

    const ratingData = {
      ...body,
      author: res.locals.user,
      product: res.locals.product
    }

    const insertQuery = {
      author: res.locals.user,
      product: res.locals.product
    }

    const insertedRating = await useInsertOnlyNotExists(ratingData, Rating, insertQuery)

    if (!insertedRating) {
      return useErrorMessage('this user has already submitted a rating', 400, res)
    }

    delete insertedRating.author
    delete insertedRating.product

    return res
      .status(201)
      .json(insertedRating)
  }

  @DefinePermissions('REMOVE_RATING')
  async remove (req: Request, res: NewResponse) {
    const { ratingId } = req.params

    const ratingRepository = getRepository(Rating)

    const deleteResult = await ratingRepository.delete({
      id: ratingId,
      product: res.locals.product,
      author: res.locals.user
    })

    if (deleteResult.affected) {
      return res
        .sendStatus(200)
    }

    return useErrorMessage('rating does not exists or does not belong to that product', 400, res)
  }

  async index (req: Request, res: NewResponse) {
    const ratingRepository = getRepository(Rating)

    const paginator = usePaginator(req.query)
    const searchParams = useSearchParams(
      req.query,
      ratingRepository,
      ['id', 'author', 'product', 'stars']
    )

    const ratings = await ratingRepository.find({
      ...paginator,
      where: {
        product: res.locals.product,
        ...searchParams
      }
    })

    const buildedResponse = await useResponseBuilder(
      ratings,
      paginator,
      searchParams,
      ratingRepository
    )

    return res.json(buildedResponse)
  }

  async show (req: Request, res: NewResponse) {
    const { ratingId } = req.params

    const ratingRepository = getRepository(Rating)

    const rating = await ratingRepository.findOne({
      id: ratingId,
      product: res.locals.product
    })

    if (rating) {
      return res.status(200).json(rating)
    }

    return useErrorMessage('rating does not exists or does not belong to that product', 400, res)
  }
}

export const RatingController = new RatingControllerClass()
