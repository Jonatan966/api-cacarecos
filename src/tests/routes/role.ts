import request from 'supertest'

export const roleRoutesTests = (req: request.SuperTest<request.Test>) => {
  describe('Role routes tests', () => {
    it('Should be able to insert a role', async () => {
      const permissions = (await req.get('/permissions')).body

      await req.post('/roles')
        .send({
          name: 'BOSS',
          permissions: [permissions[0].id]
        })
        .expect(201)
        .expect(/"id":/)
        .expect(/"name":"BOSS"/)
    })

    it('Should be able to find created role', async () => {
      await req.get('/roles')
        .expect(/"name":"BOSS"/)
    })

    it('Should not be able to create a role with the same name', async () => {
      const permissions = (await req.get('/permissions')).body

      await req.post('/roles')
        .send({
          name: 'BOSS',
          permissions
        })
        .expect(400)
        .expect(/"error":/)
    })

    it('Should not be able to create a role without permission', async () => {
      await req.post('/roles')
        .send({ name: 'NO' })
        .expect(400)
        .expect(/"error":/)
    })

    it('Should be able to update role permissions', async () => {
      const roles = (await req.get('/roles')).body
      const targetRole = roles.find(role => role.name === 'BOSS')

      let permissions = (await req.get('/permissions')).body

      permissions = permissions.map(permission => permission.id)

      await req.patch(`/roles/${targetRole.id}/permissions`)
        .send({ permissions })
        .expect(200)
        .expect(res => res.body.permissions.length === permissions.length)
    })

    it('Should be able to delete role', async () => {
      const reqResult = await req.get('/roles')

      const createdPermission = reqResult.body.find(role => role.name === 'BOSS')

      await req.delete(`/roles/${createdPermission.id}`)
        .expect(200)
    })

    it('Should be able to create a temporary role for next tests', async () => {
      let permissions = (await req.get('/permissions')).body

      permissions = permissions.map(permission => permission.id)

      const existentRoles = (await req.get('/roles')).body

      if (existentRoles.find(role => role.name === 'ROUTES_TEST')) {
        return expect(1).toEqual(1)
      }

      await req.post('/roles')
        .send({
          name: 'ROUTES_TEST',
          permissions
        })
        .expect(201)
        .expect(/"id":/)
    })
  })
}
