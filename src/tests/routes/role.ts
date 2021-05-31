import request from 'supertest'

export const roleRoutesTests = (req: request.SuperTest<request.Test>) => {
  describe('Role routes tests', () => {
    let token = ''

    it('Should be able to log in and get token', async () => {
      const response = await req.post('/auth/login')
        .send({
          email: 'admin@admin.com',
          password: 'admin'
        })
        .expect(200)
        .expect(/"token":/)

      token = response.body.token
    })

    it('Should be able to insert a role', async () => {
      const permissions = (await req
        .get('/permissions')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
      ).body.results

      await req.post('/roles')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
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
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .expect(/"name":"BOSS"/)
    })

    it('Should be able to show one role', async () => {
      const targetRole = await req.get('/roles?name=BOSS')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)

      await req.get(`/roles/${targetRole.body.results[0].id}`)
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .expect(/"permissions":\[{/)
    })

    it('Should not be able to create a role with the same name', async () => {
      const permissions = (await req.get('/permissions')).body

      await req.post('/roles')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .send({
          name: 'BOSS',
          permissions
        })
        .expect(400)
        .expect(/"error":/)
    })

    it('Should not be able to create a role without permission', async () => {
      await req.post('/roles')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .send({ name: 'NO' })
        .expect(400)
        .expect(/"error":/)
    })

    it('Should be able to update role permissions', async () => {
      const roles = (await req
        .get('/roles')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
      ).body.results
      const targetRole = roles.find(role => role.name === 'BOSS')

      let permissions = (await req
        .get('/permissions')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
      ).body.results

      permissions = permissions.map(permission => permission.id)

      await req.patch(`/roles/${targetRole.id}/permissions`)
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .send({ permissions })
        .expect(200)
        .expect(res => res.body.permissions.length === permissions.length)
    })

    it('Should be able to delete role', async () => {
      const reqResult = await req.get('/roles')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)

      const createdRole = reqResult.body.results.find(role => role.name === 'BOSS')

      await req.delete(`/roles/${createdRole.id}`)
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .expect(200)
    })

    it('Should be able to create a temporary role for next tests', async () => {
      let permissions = (await req
        .get('/permissions')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
      ).body.results

      permissions = permissions.map(permission => permission.id)

      const existentRoles = (await req
        .get('/roles')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
      ).body.results

      if (existentRoles.find(role => role.name === 'ROUTES_TEST')) {
        return expect(1).toEqual(1)
      }

      await req.post('/roles')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .send({
          name: 'ROUTES_TEST',
          permissions
        })
        .expect(201)
        .expect(/"id":/)
    })
  })
}
