import request from 'supertest'

export const favoriteRoutesTests = (req: request.SuperTest<request.Test>) => {
  describe('Favorite routes tests', () => {
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

    it('Should be able to insert a favorite', async () => {
      const targetProduct = (await req.get('/products?slug=new-route-test')).body.results[0]

      await req.post(`/users/me/favorites/${targetProduct.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect(/"id":/)
    })

    it('Should be able to find created favorite', async () => {
      await req.get('/users/me/favorites')
        .expect(/"slug":"new-route-test"/)
    })

    it('Should not be able to add same product in favorite', async () => {
      const targetProduct = (await req.get('/products?slug=new-route-test')).body.results[0]

      await req.post(`/users/me/favorites/${targetProduct}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect(/"error":/)
    })

    it('Should be able to search favorite by name', async () => {
      const targetProduct = (await req.get('/products?slug=new-route-test')).body.results[0]

      const searchResponse = await req.get(`/users/me/favorites?product=${targetProduct}`)
        .expect(/"slug":"new-route-test"/)

      expect(searchResponse.body.results).toHaveLength(1)
    })

    it('Should be able to delete favorite', async () => {
      const targetProduct = (await req.get('/products?slug=new-route-test')).body.results[0]

      await req.delete(`/users/me/favorites/${targetProduct}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
    })
  })
}
