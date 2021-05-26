import { RouteTest } from '@interfaces/RouteTest'

export const userRoutesTests: RouteTest = (req) => {
  describe('User route tests', () => {
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

    it('Should be able to insert a user', async () => {
      await req.post('/users')
        .send({
          name: 'TEMP_ROUTE_TEST',
          email: 'temp-route-test@email.com',
          password: 'the-password'
        })
        .expect(201)
        .expect(/"name":"TEMP_ROUTE_TEST"/)
    })

    it('Should be able to find created user', async () => {
      await req.get('/users')
        .set('Cookie', `token=${token}`)
        .expect(/"name":"TEMP_ROUTE_TEST"/)
    })

    it('Should be able to add role to user', async () => {
      const userList = await req.get('/users')
        .set('Cookie', `token=${token}`)

      const targetUser = userList.body.results
        .find(user => user.name === 'TEMP_ROUTE_TEST')

      const rolesList = await req.get('/roles')
        .set('Cookie', `token=${token}`)

      const targetRole = rolesList.body.results
        .find(role => role.name === 'EMPLOYER')

      await req.patch(`/users/${targetUser.id}/roles`)
        .set('Cookie', `token=${token}`)
        .send({
          roles: [targetRole.id]
        })
        .expect(200)

      await req.get(`/users/${targetUser.id}`)
        .set('Cookie', `token=${token}`)
        .expect(/"name":"EMPLOYER"/)
    })

    it('Should be able to remove user role', async () => {
      const userList = await req.get('/users')
        .set('Cookie', `token=${token}`)

      const targetUser = userList.body.results
        .find(user => user.name === 'TEMP_ROUTE_TEST')

      await req.patch(`/users/${targetUser.id}/roles`)
        .set('Cookie', `token=${token}`)
        .send({
          roles: []
        })
        .expect(200)

      await req.get(`/users/${targetUser.id}`)
        .set('Cookie', `token=${token}`)
        .expect(/"roles":\[\]/)
    })

    it('Should be able to return users roles', async () => {
      await req.get('/users')
        .set('Cookie', `token=${token}`)
        .expect(/"roles":\[/)
    })

    it('Should be able to view one user and their relationships', async () => {
      const userId = (await req
        .get('/users')
        .set('Cookie', `token=${token}`)
      ).body.results[0].id

      await req.get(`/users/${userId}`)
        .set('Cookie', `token=${token}`)
        .expect(/"id":/)
        .expect(/"roles":/)
        .expect(/"orders":/)
    })

    it('Should not be able to create a user with the same email', async () => {
      await req.post('/users')
        .set('Cookie', `token=${token}`)
        .send({
          name: 'OTHER_TEST',
          email: 'temp-route-test@email.com',
          password: 'the-password'
        })
        .expect(400)
        .expect(/"error":/)
    })

    it('Should be able to delete user', async () => {
      const reqResult = await req.get('/users')
        .set('Cookie', `token=${token}`)

      const createdUser = reqResult.body.results.find(user => user.name === 'TEMP_ROUTE_TEST')

      await req.delete(`/users/${createdUser.id}`)
        .set('Cookie', `token=${token}`)
        .expect(200)
    })

    it('Should be able to create a temporary user for next tests', async () => {
      const existentUsers = (await req
        .get('/users')
        .set('Cookie', `token=${token}`)
      ).body.results

      if (existentUsers.find(user => user.name === 'ROUTES_TEST')) {
        return expect(1).toEqual(1)
      }

      await req.post('/users')
        .set('Cookie', `token=${token}`)
        .send({
          name: 'ROUTES_TEST',
          email: 'routes-test@email.com',
          password: 'the-password'
        })
        .expect(201)
        .expect(/"id":/)
    })
  })
}
