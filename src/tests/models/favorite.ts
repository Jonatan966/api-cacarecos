import { getRepository } from 'typeorm'

import { Favorite } from '@models/Favorite'
import { Product } from '@models/Product'
import { User } from '@models/User'

export const favoriteModelTests = () => {
  describe('Favorite Model', () => {
    it('Should be able to insert a favorite', async () => {
      const favoriteRepository = getRepository(Favorite)
      const userRepository = getRepository(User)
      const productRepository = getRepository(Product)

      const insertedFavorite = await favoriteRepository.insert({
        owner: await userRepository.findOne({
          email: 'alejandro@email.com'
        }),
        product: await productRepository.findOne({
          slug: 'secador-cabelo'
        })
      })

      expect(insertedFavorite.raw).toHaveLength(1)
    })

    it('Should be able to find created favorite', async () => {
      const favoriteRepository = getRepository(Favorite)
      const userRepository = getRepository(User)

      const favorite = await favoriteRepository.findOne({
        where: {
          owner: await userRepository.findOne({
            email: 'alejandro@email.com'
          })
        }
      })

      expect(favorite).toHaveProperty('id')
    })

    it('Should be able to delete favorite', async () => {
      const favoriteRepository = getRepository(Favorite)
      const userRepository = getRepository(User)
      const productRepository = getRepository(Product)

      const favorite = await favoriteRepository.findOne({
        where: {
          owner: await userRepository.findOne({
            email: 'alejandro@email.com'
          }),
          product: await productRepository.findOne({
            slug: 'secador-cabelo'
          })
        }
      })

      const result = await favoriteRepository.delete(favorite)

      expect(result).toHaveProperty('affected', 1)
    })
  })
}
