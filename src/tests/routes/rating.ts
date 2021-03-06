import { RouteTest } from '@interfaces/RouteTest'

export const ratingRoutesTests: RouteTest = (req) => {
  describe('Rating routes tests', () => {
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

    it('Should be able to insert a rating', async () => {
      const productID = (await req.get('/products')).body.results[0].id

      await req.post(`/products/${productID}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'New test',
          stars: 5
        })
        .expect(201)
        .expect(/"id":/)
    })

    it('Should be able to find created rating', async () => {
      const productID = (await req.get('/products')).body.results[0].id

      await req.get(`/products/${productID}/ratings`)
        .expect(/"content":"New test"/)
    })

    it('Should not be able to create a rating in the same product', async () => {
      const productID = (await req.get('/products')).body.results[0].id

      await req.post(`/products/${productID}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'NEW_TEST',
          stars: 2
        })
        .expect(400)
        .expect(/"error":/)
    })

    it('Should not be able to create a rating without stars', async () => {
      const productID = (await req.get('/products')).body.results[0].id

      await req.post(`/products/${productID}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'NEW_TEST'
        })
        .expect(400)
        .expect(/"error":/)
    })

    it('Should be able to delete rating', async () => {
      const product = (await req.get('/products')).body.results[0]

      const productRatings = (await req.get(`/products/${product.id}/ratings`)).body.results

      const ratingID = productRatings.find(rating => rating.content === 'New test')?.id

      await req.delete(`/products/${product.id}/ratings/${ratingID}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
    })

    it('Should be able to create a temporary rating for next tests', async () => {
      const product = (await req.get('/products')).body.results[0]

      const productRatings = (await req.get(`/products/${product.id}/ratings`)).body.results

      if (productRatings.find(rating => rating.content === 'ROUTES_TEST')) {
        return expect(1).toEqual(1)
      }

      await req.post(`/products/${product.id}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'ROUTES_TEST',
          stars: 5
        })
        .expect(201)
        .expect(/"id":/)
    })
  })
}
