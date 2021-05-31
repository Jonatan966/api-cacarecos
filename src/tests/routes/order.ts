import { RouteTest } from '@interfaces/RouteTest'

export const orderRoutesTests: RouteTest = (req) => {
  describe('Order routes tests', () => {
    let token = ''
    let createdOrderId = ''

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

    it('Should be able to insert a order', async () => {
      const product = (await req.get('/products')).body.results[0]

      const testResponse = await req
        .post('/orders')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .send({
          products: [{
            id: product.id,
            units: 5
          }]
        })
        .expect(201)
        .expect(/"id"/)

      createdOrderId = testResponse.body.id
    })

    it('Should be able to find created order', async () => {
      await req
        .get(`/orders/${createdOrderId}`)
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .expect(200)
        .expect(new RegExp(`"id":"${createdOrderId}"`))
    })

    it('Should be able to change order status', async () => {
      await req
        .patch(`/orders/${createdOrderId}/status`)
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .send({ status: 'PreparingDelivery' })
        .expect(200)
    })

    it('Should not be able to change wrong order status', async () => {
      await req
        .patch(`/orders/${createdOrderId}/status`)
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .send({ status: 'BLA' })
        .expect(400)
    })

    it('Should be able to cancel order', async () => {
      await req
        .delete(`/orders/${createdOrderId}`)
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .expect(200)
    })
  })
}
