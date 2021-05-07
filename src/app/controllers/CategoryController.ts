
import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useInsertOnlyNotExists } from '@hooks/useInsertOnlyNotExists'
import { Category } from '@models/Category'

export const CategoryController = {
  async create (req: Request, res: Response) {
    const { name, color } = req.body

    const insertedCategory = await useInsertOnlyNotExists({ name, color }, Category, { name })

    if (!insertedCategory) {
      return useErrorMessage('category already exists', 400, res)
    }

    return res
      .status(201)
      .json(insertedCategory)
  },

  async remove (req: Request, res: Response) {
    const { id } = req.params

    const categoryRepository = getRepository(Category)

    const deleteResult = await categoryRepository.delete(id)

    if (deleteResult.affected) {
      return res
        .sendStatus(200)
    }

    return useErrorMessage('category does not exists', 400, res)
  },

  async index (_req: Request, res: Response) {
    const categoryRepository = getRepository(Category)

    const categories = await categoryRepository.find()

    return res.json(categories)
  },

  async show (req: Request, res: Response) {
    const { id } = req.params

    const categoryRepository = getRepository(Category)

    const category = await categoryRepository.findOne(id)

    if (category) {
      return res.status(200).json(category)
    }

    return useErrorMessage('category does not exists', 400, res)
  }
}
