import { RouteTest } from 'src/@types/RouteTest'

export const authRoutesTests: RouteTest = (req) => {
  describe('Auth routes tests', () => {
    let token = ''

    it('Should be able to log in and get token', async () => {
      const response = await req.post('/auth/login')
        .send({
          email: 'routes-test@email.com',
          password: 'the-password'
        })
        .expect(200)
        .expect(/"token":/)

      token = response.body.token
    })

    it('Should not be able to log in with wrong credentials', async () => {
      await req.post('/auth/login')
        .send({
          email: 'routes-test@email.com',
          password: 'wrong-password'
        })
        .expect(400)
        .expect(/"incorrect username and\/or password"/)
    })

    it('Should be able to log out', async () => {
      await req.get('/auth/logout')
        .set('Cookie', `token=${token}`)
        .expect(200)
    })

    it('Should not be able to log out with the invalidated token', async () => {
      await req.get('/auth/logout')
        .set('Cookie', `token=${token}`)
        .expect(400)
    })
  })
}
