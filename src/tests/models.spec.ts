import { Permission } from '@models/Permission'
import { Role } from '@models/Role'
import { createConnection, getConnectionOptions, getRepository } from 'typeorm'

async function getConn () {
  const options = (await getConnectionOptions())
  await createConnection(options)
}

describe('Permission Model', () => {
  beforeAll(getConn)

  it('Should be able to insert a permission', async () => {
    const permissionRepository = getRepository(Permission)

    const insertedPermission = await permissionRepository.insert({
      name: 'BUY'
    })

    expect(insertedPermission.raw).toHaveLength(1)
  })

  it('Should be able to find created permission', async () => {
    const permissionRepository = getRepository(Permission)

    const permission = await permissionRepository.findOne({
      where: {
        name: 'BUY'
      }
    })

    expect(permission).toHaveProperty('name', 'BUY')
  })

  it('Should not be able to create a permission with the same name', async () => {
    const permissionRepository = getRepository(Permission)

    try {
      const duplicatedPermission = await permissionRepository.insert({
        name: 'BUY'
      })

      expect(duplicatedPermission.raw).toHaveLength(0)
    } catch (err) {
      expect(err).toHaveProperty('code', '23505') // duplicate key value error
    }
  })

  it('Should be able to edit permission name', async () => {
    const permissionRepository = getRepository(Permission)

    const permission = await permissionRepository.findOne({
      where: {
        name: 'BUY'
      }
    })

    const result = await permissionRepository.update(permission, {
      name: 'SELL'
    })

    expect(result).toHaveProperty('affected', 1)
  })

  it('Should be able to delete permission', async () => {
    const permissionRepository = getRepository(Permission)

    const permission = await permissionRepository.findOne({
      where: {
        name: 'SELL'
      }
    })

    const result = await permissionRepository.delete(permission)

    expect(result).toHaveProperty('affected', 1)
  })

  it('Should be able to create a temporary permission for next tests', async () => {
    const permissionRepository = getRepository(Permission)

    const permissionAlreadyExists = await permissionRepository.findOne({
      name: 'TEST'
    })

    if (permissionAlreadyExists?.id) {
      expect(permissionAlreadyExists).toHaveProperty('id')
      return
    }

    const insertedPermission = await permissionRepository.insert({
      name: 'TEST'
    })

    expect(insertedPermission.raw).toHaveLength(1)
  })
})

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
