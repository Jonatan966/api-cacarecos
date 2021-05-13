import { getRepository } from 'typeorm'

import { Product } from '@models/Product'

export const relationRatingAndProductTests = () => {
  describe('Relation with Rating and Product models', () => {
    it('Should be able to return ratings when querying product', async () => {
      const productRepository = getRepository(Product)

      const product = await productRepository.find({
        relations: ['ratings']
      })

      expect(product[0].ratings.length).toBeGreaterThanOrEqual(1)
    })
  })
}
