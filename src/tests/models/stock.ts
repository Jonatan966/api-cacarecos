import { getRepository } from 'typeorm'

import { Product } from '@models/Product'
import { Stock } from '@models/Stock'
import { User } from '@models/User'

export const stockModelTests = () => {
  describe('Stock Model', () => {
    it('Should be able to insert a stock', async () => {
      const stockRepository = getRepository(Stock)
      const productRepository = getRepository(Product)
      const userRepository = getRepository(User)

      const insertedStock = await stockRepository.insert({
        product: await productRepository.findOne({
          slug: 'secador-cabelo'
        }),
        registeredBy: await userRepository.findOne({
          email: 'alejandro@email.com'
        }),
        units: 20
      })

      expect(insertedStock.raw).toHaveLength(1)
    })

    it('Should be able to find created stock', async () => {
      const stockRepository = getRepository(Stock)
      const productRepository = getRepository(Product)

      const stock = await stockRepository.findOne({
        where: {
          product: await productRepository.findOne({
            slug: 'secador-cabelo'
          })
        }
      })

      expect(stock).toHaveProperty('units', 20)
    })

    it('Should be able to delete stock', async () => {
      const stockRepository = getRepository(Stock)
      const productRepository = getRepository(Product)

      const stock = await stockRepository.findOne({
        where: {
          product: await productRepository.findOne({
            slug: 'secador-cabelo'
          })
        }
      })

      const result = await stockRepository.remove(stock)

      expect(result).toHaveProperty('id', undefined)
    })
  })
}
