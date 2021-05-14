import { DefaultController } from 'src/@types/Controller'
import { getRepository } from 'typeorm'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useInsertOnlyNotExists } from '@hooks/useInsertOnlyNotExists'
import { useObjectValidation } from '@hooks/useObjectValidation'
import { Rating } from '@models/Rating'

import { RatingProps, RatingSchema } from '../schemas/RatingSchema'

export const RatingController: DefaultController<Rating> = {
  async create (req, res) {
    const { $isError, ...body } = await useObjectValidation<RatingProps>(req.body, RatingSchema)

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

    return res
      .status(201)
      .json(insertedRating)
  },

  async remove (req, res) {
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
  },

  async index (_req, res) {
    const ratingRepository = getRepository(Rating)

    const ratings = await ratingRepository.find({
      product: res.locals.product
    })

    return res.json(ratings)
  },

  async show (req, res) {
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
