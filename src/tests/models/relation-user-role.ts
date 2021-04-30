import { Role } from '@models/Role'
import { User } from '@models/User'
import { getRepository } from 'typeorm'

export const relationUserAndRoleTests = () => {
  describe('Relation with User and Role models', () => {
    it('Should be able to add a permission to an existing role', async () => {
      const roleRepo = getRepository(Role)
      const userRepo = getRepository(User)

      const selectedRole = await roleRepo.findOne({
        name: 'TEST'
      })

      var selectedUser = await userRepo.findOne({
        email: 'alejandro@email.com'
      })

      selectedUser.roles = [selectedRole]

      const saveResult = await userRepo.save(selectedUser)

      expect(saveResult.roles).toHaveLength(1)
    })

    it('Should be able to return permissions when querying a user', async () => {
      const userRepo = getRepository(User)

      const selectedUser = await userRepo.findOne({
        email: 'alejandro@email.com'
      }, { relations: ['roles'] })

      expect(selectedUser.roles).toHaveLength(1)
    })
  })
}
