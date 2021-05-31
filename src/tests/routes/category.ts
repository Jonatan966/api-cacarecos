import request from 'supertest'

export const categoryRoutesTests = (req: request.SuperTest<request.Test>) => {
  describe('Category routes tests', () => {
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

    it('Should be able to insert a category', async () => {
      await req.post('/categories')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .send({
          name: 'NEW_TEST',
          color: '#abcdef'
        })
        .expect(201)
        .expect(/"id":/)
    })

    it('Should be able to find created category', async () => {
      await req.get('/categories')
        .expect(/"name":"NEW_TEST"/)
    })

    it('Should not be able to create a category with the same name', async () => {
      await req.post('/categories')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .send({
          name: 'NEW_TEST',
          color: '#BDBEFD'
        })
        .expect(400)
        .expect(/"error":/)
    })

    it('Should be able to create a temporary category for next tests', async () => {
      const existentCategories = (await req.get('/categories')).body.results

      if (existentCategories.find(category => category.name === 'ROUTES_TEST')) {
        return expect(1).toEqual(1)
      }

      await req.post('/categories')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .send({
          name: 'ROUTES_TEST',
          color: '#BDBEFD'
        })
        .expect(201)
        .expect(/"id":/)
    })

    it('Should be able to search category by name', async () => {
      const searchResponse = await req.get('/categories?name=ROUTES_TEST')
        .expect(/"name":"ROUTES_TEST"/)

      expect(searchResponse.body.results).toHaveLength(1)
    })

    it('Should be able to delete category', async () => {
      const reqResult = await req.get('/categories')

      const createdCategory = reqResult.body.results.find(category => category.name === 'NEW_TEST')

      await req.delete(`/categories/${createdCategory.id}`)
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .expect(200)
    })
  })
}
