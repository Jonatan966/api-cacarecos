
import { Request } from 'express'
import { getRepository } from 'typeorm'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useInsertOnlyNotExists } from '@hooks/useInsertOnlyNotExists'
import { useObjectValidation } from '@hooks/useObjectValidation'
import { AutoBindClass } from '@interfaces/AutoBind'
import { NewResponse } from '@interfaces/Controller'
import { Category } from '@models/Category'
import { Product } from '@models/Product'
import { ProductImage } from '@models/ProductImage'
import { ImageUploadProvider } from '@providers/ImageUploadProvider'
import { makeSchemaFieldsOptional } from '@utils/makeSchemaFieldsOptional'
import { slugCreator } from '@utils/slugCreator'

import { ProductObjectSchema } from '../schemas/ProductSchema'

class ProductControllerClass extends AutoBindClass {
  async create (req: Request, res: NewResponse) {
    const {
      $isError,
      main_image,
      ...body
    } = await useObjectValidation(req.body, ProductObjectSchema)

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

    const uploadResult = await this._uploadProductImages(
      req.files as any ?? [],
      insertedProduct,
      main_image.identifier
    )

    return res
      .status(201)
      .json({
        ...insertedProduct,
        images: uploadResult as any
      })
  }

  async remove (_req: Request, res: NewResponse) {
    const productRepository = getRepository(Product)

    try {
      await productRepository.remove([res.locals.product])

      return res
        .sendStatus(200)
    } catch {
      return useErrorMessage('it is not possible to delete this product', 500, res)
    }
  }

  async index (_req: Request, res: NewResponse) {
    const productRepository = getRepository(Product)
    const productImageRepository = getRepository(ProductImage)

    const products = await productRepository.find()
    const productsImages = await productImageRepository.find({
      where: products.map(product => ({ product, primary: true }))
    })

    const productsWithImage = products.map(product => ({
      ...product,
      main_image: productsImages.find(productImages =>
        productImages.id.includes(product.id)
      )
    }))

    return res
      .status(200)
      .json(productsWithImage as any)
  }

  async show (req: Request, res: NewResponse) {
    const { id } = req.params

    const productRepository = getRepository(Product)

    const product = await productRepository.findOne(id, {
      relations: ['images']
    })

    if (product) {
      return res.status(200).json(product)
    }

    return useErrorMessage('product does not exists', 400, res)
  }

  async update (req: Request, res: NewResponse) {
    const { id: productId } = req.params
    const {
      $isError,
      main_image,
      ...body
    } = await useObjectValidation(req.body, {
      ...ProductObjectSchema,
      YupSchema: makeSchemaFieldsOptional(ProductObjectSchema.YupSchema)
    })

    if ($isError) {
      return useErrorMessage('invalid fields', 400, res, {
        fields: body
      })
    }

    console.log(main_image)

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

  private async _uploadProductImages (imageFiles: Express.Multer.File[], product: Product, mainImageFilename: string) {
    const productImageRepository = getRepository(ProductImage)

    const formatedImageFiles = imageFiles.map(imageFile => ({
      path: imageFile.path,
      originalname: imageFile.originalname
    }))

    if (formatedImageFiles.length) {
      const uploadResult = await ImageUploadProvider.uploadMany(product.id,
        formatedImageFiles.map(imageFile => imageFile.path)
      )
      const onlyUploadedImages = uploadResult.filter(imageItem => !imageItem.failed)

      await productImageRepository.save(
        onlyUploadedImages.map(uploadedImage =>
          ({
            id: uploadedImage.id,
            url: uploadedImage.url,
            product,
            primary: formatedImageFiles.find(imageFile =>
              imageFile.path === uploadedImage.oldpath
            ).originalname === mainImageFilename
          })
        )
      )

      return uploadResult.map(uploadedItem => ({ url: uploadedItem.url, id: uploadedItem.id }))
    }
  }
}

export const ProductController = new ProductControllerClass()
