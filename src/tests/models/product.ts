import { getRepository } from 'typeorm'

import { Category } from '@models/Category'
import { Product } from '@models/Product'

export const productModelTests = () => {
  describe('Product Model', () => {
    it('Should be able to insert a product', async () => {
      const productRepository = getRepository(Product)
      const categoryRepository = getRepository(Category)

      const category = await categoryRepository.find()

      const insertedProduct = await productRepository.insert({
        name: 'Paciência em Gotas',
        slug: 'paciencia-em-gotas',
        description: 'Um interessante product',
        price: 250,
        units: 20,
        category: category[0]
      })

      expect(insertedProduct.raw).toHaveLength(1)
    })

    it('Should be able to find created product', async () => {
      const productRepository = getRepository(Product)

      const product = await productRepository.findOne({
        where: {
          name: 'Paciência em Gotas'
        }
      })

      expect(product).toHaveProperty('name', 'Paciência em Gotas')
    })

    it('Should not be able to create a product with the same name', async () => {
      const productRepository = getRepository(Product)
      const categoryRepository = getRepository(Category)

      const category = await categoryRepository.find()

      try {
        const duplicatedProduct = await productRepository.insert({
          name: 'Paciência em Gotas',
          slug: 'paciencia-com-gotas',
          description: 'Um interessante product',
          price: 250,
          units: 20,
          category: category[0]
        })

        expect(duplicatedProduct.raw).toHaveLength(0)
      } catch (err) {
        expect(err).toHaveProperty('code', '23505') // duplicate key value error
      }
    })

    it('Should be able to edit product name', async () => {
      const productRepository = getRepository(Product)

      const product = await productRepository.findOne({
        where: {
          name: 'Paciência em Gotas'
        }
      })

      const result = await productRepository.update(product, {
        name: 'Paciência em forma de gotas'
      })

      expect(result).toHaveProperty('affected', 1)
    })

    it('Should be able to delete product', async () => {
      const productRepository = getRepository(Product)

      const product = await productRepository.findOne({
        where: {
          name: 'Paciência em forma de gotas'
        }
      })

      const result = await productRepository.delete(product)

      expect(result).toHaveProperty('affected', 1)
    })

    it('Should be able to create a temporary product for next tests', async () => {
      const productRepository = getRepository(Product)
      const categoryRepository = getRepository(Category)

      const category = await categoryRepository.find()

      const productAlreadyExists = await productRepository.findOne({
        name: 'Secador de Cabelo'
      })

      if (productAlreadyExists?.id) {
        expect(productAlreadyExists).toHaveProperty('id')
        return
      }

      const insertedProduct = await productRepository.insert({
        name: 'Secador de Cabelo',
        slug: 'secador-cabelo',
        description: 'Um interessante produto',
        price: 250,
        units: 20,
        category: category[0]
      })

      expect(insertedProduct.raw).toHaveLength(1)
    })
  })
}
