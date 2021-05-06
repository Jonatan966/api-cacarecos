import { getRepository } from 'typeorm'

import { Product } from '@models/Product'

export const relationProductAndCategory = () => {
  describe('Relation with Product and Category models', () => {
    it('Should be able to return category when querying a product', async () => {
      const productRepo = getRepository(Product)

      const selectedProduct = await productRepo.findOne({
        name: 'Secador de Cabelo'
      }, { relations: ['category'] })

      expect(selectedProduct.category).toHaveProperty('color')
    })
  })
}
