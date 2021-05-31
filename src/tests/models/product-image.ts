import { getRepository } from 'typeorm'

import { Product } from '@models/Product'
import { ProductImage } from '@models/ProductImage'

export const productImageModelTests = () => {
  describe('ProductImage Model', () => {
    it('Should be able to insert a product image', async () => {
      const productImageRepository = getRepository(ProductImage)
      const productRepository = getRepository(Product)

      const insertedProductImage = await productImageRepository.save({
        id: 'TEST',
        product: await productRepository.findOne({
          slug: 'secador-cabelo'
        }),
        url: 'test.com/image.png'
      })

      expect(insertedProductImage).toHaveProperty('id')
    })

    it('Should be able to find created product image', async () => {
      const productImageRepository = getRepository(ProductImage)

      const productImage = await productImageRepository.findOne('TEST')

      expect(productImage).toHaveProperty('url', 'test.com/image.png')
    })

    it('Should be able to delete product image', async () => {
      const productImageRepository = getRepository(ProductImage)

      const productImage = await productImageRepository.findOne('TEST')

      const result = await productImageRepository.delete(productImage)

      expect(result).toHaveProperty('affected', 1)
    })

    it('Should be able to create a temporary product image', async () => {
      const productImageRepository = getRepository(ProductImage)
      const productRepository = getRepository(Product)

      const insertedProductImage = await productImageRepository.save({
        id: 'TEMP',
        product: await productRepository.findOne({
          slug: 'secador-cabelo'
        }),
        url: 'test.com/image.png'
      })

      expect(insertedProductImage).toHaveProperty('id')
    })
  })
}
