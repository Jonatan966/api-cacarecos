import { RouteTest } from '@interfaces/RouteTest'

export const userRoutesTests: RouteTest = (req) => {
  describe('User route tests', () => {
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
        .expect(/"name":"TEMP_ROUTE_TEST"/)
    })

    it('Should be able to return users roles', async () => {
      await req.get('/users')
        .expect(/"roles":\[/)
    })

    it('Should be able to view one user and their relationships', async () => {
      const userId = (await req.get('/users')).body.results[0].id

      await req.get(`/users/${userId}`)
        .expect(/"id":/)
        .expect(/"roles":/)
        .expect(/"orders":/)
    })

    it('Should not be able to return users passwords', async () => {
      const user = (await req.get('/users')).body.results[0]

      expect(user.password).toBeUndefined()
    })

    it('Should not be able to create a user with the same email', async () => {
      await req.post('/users')
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

      const createdUser = reqResult.body.results.find(user => user.name === 'TEMP_ROUTE_TEST')

      await req.delete(`/users/${createdUser.id}`)
        .expect(200)
    })

    it('Should be able to create a temporary user for next tests', async () => {
      const existentUsers = (await req.get('/users')).body.results

      if (existentUsers.find(user => user.name === 'ROUTES_TEST')) {
        return expect(1).toEqual(1)
      }

      await req.post('/users')
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
