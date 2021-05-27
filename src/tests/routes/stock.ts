import { RouteTest } from '@interfaces/RouteTest'

export const stockRoutesTests: RouteTest = (req) => {
  describe('Stock route tests', () => {
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

    it('Should be able to add stock item', async () => {
      const targetProduct = (await req.get('/products')).body.results[0]

      await req.patch(`/products/${targetProduct.id}/stock`)
        .set('Cookie', `token=${token}`)
        .send({
          units: 20
        })
        .expect(201)
        .expect(/"id":/)

      await req.patch(`/products/${targetProduct.id}/stock`)
        .set('Cookie', `token=${token}`)
        .send({
          units: -10
        })
        .expect(201)
        .expect(/"id":/)
    })

    it('Should be able to list product stock', async () => {
      const targetProduct = (await req.get('/products')).body.results[0]

      await req.get(`/products/${targetProduct.id}/stock`)
        .set('Cookie', `token=${token}`)
        .expect(/"totalProductUnits":"10"/)
    })
  })
}
