import { getRepository } from 'typeorm'

import { Permission } from '@models/Permission'
import { Role } from '@models/Role'

export const relationPermissionAndRoleTests = () => {
  describe('Relation with Permission and Role models', () => {
    it('Should be able to add a permission to an existing role', async () => {
      const roleRepo = getRepository(Role)
      const permissionRepo = getRepository(Permission)
      // BUY
      var selectedRole = await roleRepo.findOne({
        name: 'TEST'
      })

      const selectedPermission = await permissionRepo.findOne({
        name: 'TEST'
      })

      selectedRole.permissions = [selectedPermission]

      const saveResult = await roleRepo.save(selectedRole)

      expect(saveResult.permissions).toHaveLength(1)
    })

    it('Should be able to return permissions when querying a role', async () => {
      const roleRepo = getRepository(Role)

      const selectedRole = await roleRepo.findOne({
        name: 'TEST'
      }, { relations: ['permissions'] })

      expect(selectedRole.permissions).toHaveLength(1)
    })
  })
}
