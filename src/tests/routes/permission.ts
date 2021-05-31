import request from 'supertest'

export const permissionRoutesTests = (req: request.SuperTest<request.Test>) => {
  describe('Permision routes tests', () => {
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

    it('Should be able to insert a permission', async () => {
      await req.post('/permissions')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .send({
          name: 'NEW_TEST'
        })
        .expect(201)
        .expect(/"id":/)
    })

    it('Should be able to find created permission', async () => {
      await req.get('/permissions?name=NEW_TEST')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .expect(/"name":"NEW_TEST"/)
    })

    it('Should not be able to create a permission with the same name', async () => {
      await req.post('/permissions')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .send({
          name: 'NEW_TEST'
        })
        .expect(400)
        .expect(/"error":/)
    })

    it('Should be able to delete permission', async () => {
      const reqResult = await req
        .get('/permissions?name=NEW_TEST')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)

      const createdPermission = reqResult.body.results.find(permission => permission.name === 'NEW_TEST')

      await req.delete(`/permissions/${createdPermission.id}`)
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .expect(200)
    })

    it('Should be able to create a temporary permission for next tests', async () => {
      const existentPermissions = (await req
        .get('/permissions')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
      ).body.results

      if (existentPermissions.find(permission => permission.name === 'ROUTES_TEST')) {
        return expect(1).toEqual(1)
      }

      await req.post('/permissions')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .send({
          name: 'ROUTES_TEST'
        })
        .expect(201)
        .expect(/"id":/)
    })
  })
}
