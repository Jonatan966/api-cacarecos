import { getRepository } from 'typeorm'

import { Role } from '@models/Role'

export const roleModelTests = () => {
  describe('Role Model', () => {
    it('Should be able to insert a role', async () => {
      const roleRepository = getRepository(Role)

      const insertedRole = await roleRepository.insert({
        name: 'CLIENT'
      })

      expect(insertedRole.raw).toHaveLength(1)
    })

    it('Should be able to find created role', async () => {
      const roleRepository = getRepository(Role)

      const role = await roleRepository.findOne({
        where: {
          name: 'CLIENT'
        }
      })

      expect(role).toHaveProperty('name', 'CLIENT')
    })

    it('Should not be able to create a role with the same name', async () => {
      const roleRepository = getRepository(Role)

      try {
        const duplicatedRole = await roleRepository.insert({
          name: 'CLIENT'
        })

        expect(duplicatedRole.raw).toHaveLength(0)
      } catch (err) {
        expect(err).toHaveProperty('code', '23505') // duplicate key value error
      }
    })

    it('Should be able to edit role name', async () => {
      const roleRepository = getRepository(Role)

      const role = await roleRepository.findOne({
        where: {
          name: 'CLIENT'
        }
      })

      const result = await roleRepository.update(role, {
        name: 'EMPLOYEE'
      })

      expect(result).toHaveProperty('affected', 1)
    })

    it('Should be able to delete role', async () => {
      const roleRepository = getRepository(Role)

      const role = await roleRepository.findOne({
        where: {
          name: 'EMPLOYEE'
        }
      })

      const result = await roleRepository.delete(role)

      expect(result).toHaveProperty('affected', 1)
    })

    it('Should be able to create a temporary role for next tests', async () => {
      const roleRepository = getRepository(Role)

      const roleAlreadyExists = await roleRepository.findOne({
        name: 'TEST'
      })

      if (roleAlreadyExists?.id) {
        expect(roleAlreadyExists).toHaveProperty('id')
        return
      }

      const insertedRole = await roleRepository.insert({
        name: 'TEST'
      })

      expect(insertedRole.raw).toHaveLength(1)
    })
  })
}
