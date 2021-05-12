import { DefaultController } from 'src/@types/Controller'
import { getRepository } from 'typeorm'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useInsertOnlyNotExists } from '@hooks/useInsertOnlyNotExists'
import { useObjectValidation } from '@hooks/useObjectValidation'
import { Category } from '@models/Category'
import { Product } from '@models/Product'
import { makeSchemaFieldsOptional } from '@utils/makeSchemaFieldsOptional'
import { slugCreator } from '@utils/slugCreator'

import { ProductProps, ProductSchema } from '../schemas/ProductSchema'

export const ProductController: DefaultController<Product> = {
  async create (req, res) {
    const {
      $isError,
      ...body
    } = await useObjectValidation<ProductProps>(req.body, ProductSchema)

    if ($isError) {
      return useErrorMessage('invalid fields', 400, res, {
        fields: body
      })
    }

    const categoryRepository = getRepository(Category)

    const findedCategory = await categoryRepository.findOne(body.category)

    if (!findedCategory) {
      return useErrorMessage('there is no category with this id', 400, res)
    }

    const insertedProduct = await useInsertOnlyNotExists({
      ...body,
      price: body.price,
      units: body.units,
      slug: slugCreator(body.slug),
      category: findedCategory
    }, Product, { name: body.name })

    if (!insertedProduct) {
      return useErrorMessage('there is already a product with that name', 400, res)
    }

    return res
      .status(201)
      .json(insertedProduct)
  },

  async remove (req, res) {
    const { id } = req.params

    const productRepository = getRepository(Product)

    const deleteResult = await productRepository.delete(id)

    if (deleteResult.affected) {
      return res
        .sendStatus(200)
    }

    return useErrorMessage('product does not exists', 400, res)
  },

  async index (_req, res) {
    const productRepository = getRepository(Product)

    const products = await productRepository.find()

    return res
      .status(200)
      .json(products)
  },

  async show (req, res) {
    const { id } = req.params

    const productRepository = getRepository(Product)

    const product = await productRepository.findOne(id)

    if (product) {
      return res.status(200).json(product)
    }

    return useErrorMessage('product does not exists', 400, res)
  },

  async update (req, res) {
    const { id: productId } = req.params
    const {
      $isError,
      ...body
    } = await useObjectValidation<Partial<ProductProps>>(req.body, makeSchemaFieldsOptional(ProductSchema))

    if ($isError) {
      return useErrorMessage('invalid fields', 400, res, {
        fields: body
      })
    }

    const categoryRepository = getRepository(Category)
    const productRepository = getRepository(Product)

    const product = await productRepository.findOne(productId)

    if (!product) {
      return useErrorMessage('product does not exists', 400, res)
    }

    let findedCategory

    if (body.category) {
      findedCategory = await categoryRepository.findOne(body.category)
    }

    if (body.category && !findedCategory) {
      return useErrorMessage('there is no category with this id', 400, res)
    }

    const updatedProductResult = await productRepository.save({
      ...product,
      ...body,
      category: findedCategory ?? product.category
    })

    return res
      .status(200)
      .json(updatedProductResult)
  }
}
