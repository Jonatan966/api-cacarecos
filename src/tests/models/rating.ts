import { Product } from '@models/Product'
import { Rating } from '@models/Rating'
import { User } from '@models/User'
import { getRepository } from 'typeorm'

export const ratingModelTests = () => {
  describe('Rating model tests', () => {
    it('Should be able to insert a rating', async () => {
      const ratingRepository = getRepository(Rating)
      const userRepository = getRepository(User)
      const productRepository = getRepository(Product)

      const insertedRating = await ratingRepository.insert({
        content: 'Produto incrível',
        stars: 5,
        author: (await userRepository.find())[0],
        product: (await productRepository.find())[0]
      })

      expect(insertedRating.raw).toHaveLength(1)
    })

    it('Should be able to find created rating', async () => {
      const ratingRepository = getRepository(Rating)
      const userRepository = getRepository(User)

      const rating = await ratingRepository.findOne({
        where: {
          author: (await userRepository.find())[0]
        }
      })

      expect(rating).toHaveProperty('stars', 5)
    })

    it('Should be able to delete rating', async () => {
      const ratingRepository = getRepository(Rating)
      const userRepository = getRepository(User)

      const rating = await ratingRepository.findOne({
        where: {
          author: (await userRepository.find())[0]
        }
      })
      const result = await ratingRepository.delete(rating.id)

      expect(result).toHaveProperty('affected', 1)
    })

    it('Should be able to create a temporary rating for next tests', async () => {
      const ratingRepository = getRepository(Rating)
      const userRepository = getRepository(User)
      const productRepository = getRepository(Product)

      const ratingAlreadyExists = await ratingRepository.findOne({
        author: (await userRepository.find())[0]
      })

      if (ratingAlreadyExists?.id) {
        expect(ratingAlreadyExists).toHaveProperty('id')
        return
      }

      const insertedRating = await ratingRepository.insert({
        content: 'Produto teste',
        stars: 5,
        author: (await userRepository.find())[0],
        product: (await productRepository.find())[0]
      })

      expect(insertedRating.raw).toHaveLength(1)
    })
  })
}
