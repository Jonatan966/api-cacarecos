
import { getManager } from 'typeorm'
import { v4 as generateUUID } from 'uuid'

import { useHashString } from '@hooks/useHashString'

export const userAdminCreation = () => {
  describe('Admin user registration', () => {
    it('Should be able to create user', async () => {
      await getManager().query(`
        INSERT INTO users(name, email, password, login_id)
        VALUES('Admin', 'admin@admin.com', $1, $2)
      `, [await useHashString('admin'), generateUUID()])

      const createdUser = await getManager().query("SELECT * FROM users WHERE name = 'Admin'")

      expect(createdUser).toHaveLength(1)
    })

    it('Should be able to create permissions', async () => {
      await getManager().query(`
        INSERT INTO permissions(name)
        VALUES('BUY'),('ADD_RATING'),('REMOVE_RATING'),('ADD_PRODUCT')
        ,('VIEW_PRODUCT_UNITS'),('LIST_USERS'),('SHOW_USER'),('EDIT_PRODUCT')
        ,('VIEW_ORDERS'),('FINISH_ORDER'),('ADD_CATEGORY')
        ,('REMOVE_CATEGORY'),('REMOVE_PRODUCT'),('REMOVE_USER')
       ,('EDIT_USER'),('ADD_PERMISSION'),('LIST_PERMISSIONS')
       ,('REMOVE_PERMISSION'),('ADD_ROLE'),('EDIT_ROLE')
       ,('REMOVE_ROLE'),('VIEW_ROLES'),('UPDATE_ORDER'),('UPDATE_USER')
       ,('ADD_STOCK'),('LIST_STOCKS'),('FAVORITE')
      `)

      const createdPermissions = await getManager().query('SELECT COUNT(*) FROM permissions')

      expect(createdPermissions).toHaveLength(1)
      expect(createdPermissions[0]).toHaveProperty('count', '27')
    })

    it('Should be able to create roles', async () => {
      await getManager().query(`
        INSERT INTO roles(name)
        VALUES('ADMIN'),('EMPLOYER')
      `)

      const createdRoles = await getManager().query('SELECT COUNT(*) FROM roles')

      expect(createdRoles).toHaveLength(1)
      expect(createdRoles[0]).toHaveProperty('count', '2')
    })

    it('Should be able to relate roles to permissions', async () => {
      const role = await getManager().query('SELECT * FROM roles')
      const permissions = await getManager().query('SELECT * FROM permissions')

      const formatedPermissions = permissions.map((permission) =>
      `('${role[0].id}', '${permission.id}')`
      ).join()

      await getManager().query(`
        INSERT INTO role_permissions
        VALUES ${formatedPermissions}
      `)

      const createdRolePermissions = await getManager().query('SELECT COUNT(*) FROM role_permissions')

      expect(createdRolePermissions).toHaveLength(1)
      expect(createdRolePermissions[0]).toHaveProperty('count', String(permissions.length))
    })

    it('Should be able to relate role to user', async () => {
      const user = await getManager().query('SELECT * FROM users')
      const role = await getManager().query('SELECT * FROM roles')

      await getManager().query(`
        INSERT INTO user_roles VALUES($1, $2)
      `, [user[0].id, role[0].id])

      const createdUserRoles = await getManager().query('SELECT COUNT(*) FROM user_roles')

      expect(createdUserRoles).toHaveLength(1)
      expect(createdUserRoles[0]).toHaveProperty('count', '1')
    })
  })
}
