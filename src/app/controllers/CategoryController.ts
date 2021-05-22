import { Request } from 'express'
import { getRepository } from 'typeorm'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useInsertOnlyNotExists } from '@hooks/useInsertOnlyNotExists'
import { useObjectValidation } from '@hooks/useObjectValidation'
import { usePaginator } from '@hooks/usePaginator'
import { useResponseBuilder } from '@hooks/useResponseBuilder'
import { useSearchParams } from '@hooks/useSearchParams'
import { AutoBindClass } from '@interfaces/AutoBind'
import { AppControllerProps, NewResponse } from '@interfaces/Controller'
import { Category } from '@models/Category'

import { CategoryObjectSchema } from '../schemas/CategorySchema'

class CategoryControllerClass extends AutoBindClass implements AppControllerProps {
  async create (req: Request, res: NewResponse) {
    const { name, color, $isError } = await useObjectValidation(req.body, CategoryObjectSchema)

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
  }

  async remove (req: Request, res: NewResponse) {
    const { id } = req.params

    const categoryRepository = getRepository(Category)

    const deleteResult = await categoryRepository.delete(id)

    if (deleteResult.affected) {
      return res
        .sendStatus(200)
    }

    return useErrorMessage('category does not exists', 400, res)
  }

  async index (req: Request, res: NewResponse) {
    const categoryRepository = getRepository(Category)

    const paginator = usePaginator(req.query)
    const searchParams = useSearchParams(req.query, categoryRepository, ['id'])

    const categories = await categoryRepository.find({
      ...paginator,
      where: searchParams
    })

    const buildedResponse = await useResponseBuilder(
      categories,
      paginator,
      searchParams,
      categoryRepository
    )

    return res.json(buildedResponse)
  }

  async show (req: Request, res: NewResponse) {
    const { id } = req.params

    const categoryRepository = getRepository(Category)

    const category = await categoryRepository.findOne(id)

    if (category) {
      return res.status(200).json(category)
    }

    return useErrorMessage('category does not exists', 400, res)
  }
}

export const CategoryController = new CategoryControllerClass()
