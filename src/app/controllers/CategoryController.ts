
import { DefaultController } from 'src/@types/Controller'
import { getRepository } from 'typeorm'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useInsertOnlyNotExists } from '@hooks/useInsertOnlyNotExists'
import { useObjectValidation } from '@hooks/useObjectValidation'
import { Category } from '@models/Category'

import { CategoryProps, CategorySchema } from '../schemas/CategorySchema'

export const CategoryController: DefaultController<Category> = {
  async create (req, res) {
    const { name, color, $isError } = await useObjectValidation<CategoryProps>(req.body, CategorySchema)

    if ($isError) {
      return useErrorMessage('invalid fields', 400, res, {
        fields: { name, color }
      })
    }

    const insertedCategory = await useInsertOnlyNotExists({ name, color }, Category, { name })

    if (!insertedCategory) {
      return useErrorMessage('category already exists', 400, res)
    }

    return res
      .status(201)
      .json(insertedCategory)
  },

  async remove (req, res) {
    const { id } = req.params

    const categoryRepository = getRepository(Category)

    const deleteResult = await categoryRepository.delete(id)

    if (deleteResult.affected) {
      return res
        .sendStatus(200)
    }

    return useErrorMessage('category does not exists', 400, res)
  },

  async index (_req, res) {
    const categoryRepository = getRepository(Category)

    const categories = await categoryRepository.find()

    return res.json(categories)
  },

  async show (req, res) {
    const { id } = req.params

    const categoryRepository = getRepository(Category)

    const category = await categoryRepository.findOne(id)

    if (category) {
      return res.status(200).json(category)
    }

    return useErrorMessage('category does not exists', 400, res)
  }
}
