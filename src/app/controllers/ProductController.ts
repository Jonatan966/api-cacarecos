
import { Request } from 'express'
import { getRepository } from 'typeorm'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useInsertOnlyNotExists } from '@hooks/useInsertOnlyNotExists'
import { useObjectValidation } from '@hooks/useObjectValidation'
import { usePaginator } from '@hooks/usePaginator'
import { useResponseBuilder } from '@hooks/useResponseBuilder'
import { useSearchParams } from '@hooks/useSearchParams'
import { AutoBindClass } from '@interfaces/AutoBind'
import { NewResponse } from '@interfaces/Controller'
import { Category } from '@models/Category'
import { Product } from '@models/Product'
import { ProductImage } from '@models/ProductImage'
import { Stock } from '@models/Stock'
import { ImageUploadProvider } from '@providers/ImageUploadProvider'
import { makeSchemaFieldsOptional } from '@utils/makeSchemaFieldsOptional'
import { slugCreator } from '@utils/slugCreator'

import { DefinePermissions, findPermission } from '../decorators/DefinePermissions'
import { ProductObjectSchema } from '../schemas/ProductSchema'

class ProductControllerClass extends AutoBindClass {
  @DefinePermissions('ADD_PRODUCT')
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
      slug: slugCreator(body.slug),
      category: findedCategory
    }, Product, { name: body.name })

    if (!insertedProduct) {
      return useErrorMessage('there is already a product with that name', 400, res)
    }

    if (body.units && findPermission(res.locals.user.roles, 'ADD_STOCK')) {
      const stockRepository = getRepository(Stock)

      await stockRepository.insert({
        product: insertedProduct,
        units: body.units,
        registeredBy: res.locals.user
      })
    }

    const uploadResult = await this._uploadProductImages(
      (req.files as any) ?? [],
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

  @DefinePermissions('REMOVE_PRODUCT')
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

  async index (req: Request, res: NewResponse) {
    const productRepository = getRepository(Product)
    const productImageRepository = getRepository(ProductImage)

    const paginator = usePaginator(req.query)
    const searchParams = useSearchParams(
      req.query,
      productRepository,
      ['id', 'price', 'category'],
      ['ratings', 'images']
    )

    const products = await productRepository.find({
      ...paginator,
      where: searchParams
    })
    const productsImages = await productImageRepository.find({
      where: products.map(product => ({ product, primary: true }))
    })

    const productsWithImage = products.map(product => ({
      ...product,
      main_image: productsImages.find(productImages =>
        productImages.id.includes(product.id)
      )
    }))

    const buildedResponse = await useResponseBuilder(
      productsWithImage,
      paginator,
      searchParams,
      productRepository as any
    )

    return res
      .status(200)
      .json(buildedResponse)
  }

  async show (req: Request, res: NewResponse) {
    const { id } = req.params

    const productRepository = getRepository(Product)

    const product = await productRepository.findOne(id, {
      select: ['id', 'name', 'slug', 'description', 'otherDetails', 'price'],
      relations: ['images', 'category']
    })

    if (product) {
      return res.status(200).json(product)
    }

    return useErrorMessage('product does not exists', 400, res)
  }

  @DefinePermissions('EDIT_PRODUCT')
  async update (req: Request, res: NewResponse) {
    const { id: productId } = req.params
    const {
      $isError,
      ...body
    } = await useObjectValidation(req.body, {
      ...ProductObjectSchema,
      YupSchema: makeSchemaFieldsOptional(ProductObjectSchema.YupSchema)
        .omit(['main_image', 'old_images'])
    })

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
      .json({
        ...updatedProductResult
      })
  }

  @DefinePermissions('EDIT_PRODUCT')
  async updateImages (req: Request, res: NewResponse) {
    const { id: productId } = req.params
    const {
      $isError,
      old_images,
      main_image
    } = await useObjectValidation(req.body, {
      ...ProductObjectSchema,
      YupSchema: makeSchemaFieldsOptional(ProductObjectSchema.YupSchema).pick(['old_images', 'main_image'])
    })

    if ($isError) {
      return useErrorMessage('invalid fields', 400, res, {
        fields: {
          old_images,
          main_image
        }
      })
    }

    const productRepository = getRepository(Product)

    const product = await productRepository.findOne(productId)

    if (!product) {
      return useErrorMessage('product does not exists', 400, res)
    }

    await this.removeProductImages(old_images, product)

    if (main_image?.type === 'storaged') {
      await this.replaceMainImage(main_image.identifier, product)
    }

    const uploadResult = await this._uploadProductImages(
      (req.files as any) ?? [],
      product,
      main_image?.type === 'new' ? main_image.identifier : ''
    )

    return res.status(200).json({
      new_images: uploadResult
    })
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

      if (mainImageFilename) {
        await productImageRepository.update({ product }, {
          primary: false
        })
      }

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

  private async removeProductImages (identifiers: string[] = [], product: Product) {
    const productImageRepository = getRepository(ProductImage)

    if (!identifiers.length) {
      return
    }

    const onlyExistentProductImages = await productImageRepository.find({
      where: identifiers.map(identifier =>
        ({ id: identifier, product: product })
      )
    })

    for (const productImage of onlyExistentProductImages) {
      await ImageUploadProvider.removeImage(productImage.id)
    }

    await productImageRepository.remove(onlyExistentProductImages)
  }

  private async replaceMainImage (identifier: string, product: Product) {
    const productImageRepository = getRepository(ProductImage)

    const onlyExistentProductImage = await productImageRepository.findOne(identifier, {
      where: {
        product
      }
    })

    if (!onlyExistentProductImage) {
      return
    }

    await productImageRepository.update({ product }, {
      primary: false
    })

    await productImageRepository.update({ id: onlyExistentProductImage.id }, {
      primary: true
    })
  }
}

export const ProductController = new ProductControllerClass()
