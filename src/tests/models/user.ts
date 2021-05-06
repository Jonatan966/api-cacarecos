import { getRepository } from 'typeorm'

import { User } from '@models/User'

export const userModelTests = () => {
  describe('User Model tests', () => {
    it('Should be able to insert a user', async () => {
      const userRepository = getRepository(User)

      const insertedUser = await userRepository.insert({
        name: 'Fulano de Tal',
        email: 'fulano@email.com',
        password: 'password-super'
      })

      expect(insertedUser.raw).toHaveLength(1)
    })

    it('Should be able to find created user', async () => {
      const userRepository = getRepository(User)

      const user = await userRepository.findOne({
        where: {
          name: 'Fulano de Tal'
        }
      })

      expect(user).toHaveProperty('name', 'Fulano de Tal')
    })

    it('Should not be able to create a user with the same email', async () => {
      const userRepository = getRepository(User)

      try {
        const duplicatedUser = await userRepository.insert({
          email: 'fulano@email.com',
          name: 'Ciclano de Tal',
          password: 'password-super'
        })

        expect(duplicatedUser.raw).toHaveLength(0)
      } catch (err) {
        expect(err).toHaveProperty('code', '23505') // duplicate key value error
      }
    })

    it('Should not be able to create a user without email and password', async () => {
      const userRepository = getRepository(User)

      try {
        const wrongUser = await userRepository.insert({
          name: 'Joao Lima'
        })

        expect(wrongUser.raw).toHaveLength(0)
      } catch (err) {
        expect(err).toHaveProperty('code', '23502') // null value in column error
      }
    })

    it('Should be able to edit user name and email', async () => {
      const userRepository = getRepository(User)

      const user = await userRepository.findOne({
        where: {
          email: 'fulano@email.com'
        }
      })

      const result = await userRepository.update(user.id, {
        name: 'Fulano dos Santos',
        email: 'fulano-dos-santos@email.com'
      })

      expect(result).toHaveProperty('affected', 1)
    })

    it('Should be able to delete user', async () => {
      const userRepository = getRepository(User)

      const user = await userRepository.findOne({
        where: {
          email: 'fulano-dos-santos@email.com'
        }
      })

      const result = await userRepository.delete(user.id)

      expect(result).toHaveProperty('affected', 1)
    })

    it('Should be able to create a temporary user for next tests', async () => {
      const userRepository = getRepository(User)

      const userAlreadyExists = await userRepository.findOne({
        email: 'alejandro@email.com'
      })

      if (userAlreadyExists?.id) {
        expect(userAlreadyExists).toHaveProperty('id')
        return
      }

      const insertedUser = await userRepository.insert({
        name: 'Alejandro',
        email: 'alejandro@email.com',
        password: 'a1ejandr0'
      })

      expect(insertedUser.raw).toHaveLength(1)
    })
  })
}
