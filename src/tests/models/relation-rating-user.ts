import { Product } from '@models/Product'
import { getRepository } from 'typeorm'

export const relationRatingAndUserTests = () => {
  describe('Relation with Rating and User models', () => {
    it('Should be able to return author when querying product rating', async () => {
      const productRepository = getRepository(Product)

      const product = await productRepository.find({
        relations: ['ratings', 'ratings.author']
      })

      expect(product[0].ratings[0].author).toHaveProperty('id')
    })
  })
}
