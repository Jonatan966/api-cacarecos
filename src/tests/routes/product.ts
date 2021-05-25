import path from 'path'

import { RouteTest } from '@interfaces/RouteTest'

export const productRoutesTests: RouteTest = (req) => {
  describe('Product route tests', () => {
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

    it('Should be able to insert a product', async () => {
      const category = (await req.get('/categories')).body.results[0].id

      await req.post('/products')
        .set('Cookie', `token=${token}`)
        .attach('product_images', path.join(__dirname, '..', 'files', 'test.png'))
        .field({
          name: 'New test',
          description: 'The new test',
          slug: 'new-test',
          price: 250,
          units: 300,
          'main_image["type"]': 'new',
          'main_image["identifier"]': 'test.png',
          category
        })
        .expect(201)
        .expect(/"id":/)
        .expect(/"images":\[{/)
    })

    it('Should be able to find created product', async () => {
      await req.get('/products')
        .expect(/"name":"New test"/)
        .expect(/"color":/)
        .expect(/"main_image":{/)
    })

    it('Should be able to add image in currently created product', async () => {
      const product = (await req.get('/products')).body.results
        .find(item => item.name === 'New test')

      await req
        .patch(`/products/${product.id}/images`)
        .set('Cookie', `token=${token}`)
        .attach('product_images', path.join(__dirname, '..', 'files', 'test-two.png'))
        .field({
          'main_image["type"]': 'new',
          'main_image["identifier"]': 'test-two.png'
        })
        .expect(200)
        .expect(/"new_images":\[{/)
    })

    it('Should be able to remove product image', async () => {
      const productId = (await req.get('/products')).body.results
        .find(item => item.name === 'New test').id

      const productDetails = (await req.get(`/products/${productId}`)).body

      await req
        .patch(`/products/${productId}/images`)
        .set('Cookie', `token=${token}`)
        .send({
          old_images: [productDetails.images[0].id]
        })
        .expect(200)

      const updatedProductDetails = await req
        .get(`/products/${productId}`)

      expect(updatedProductDetails.body.images).toHaveLength(1)
    })

    it('Should be able to view product by id', async () => {
      const productId = (await req.get('/products')).body.results[0].id

      await req.get(`/products/${productId}`)
        .expect(200)
        .expect(/"id":/)
    })

    it('Should be able to update product', async () => {
      const product = (await req.get('/products')).body.results
        .find(item => item.name === 'New test')

      await req
        .put(`/products/${product.id}`)
        .set('Cookie', `token=${token}`)
        .send({
          other_details: 'Um detalhe'
        })
        .expect(/"other_details":"Um detalhe"/)
    })

    it('Should not be able to create a product with the same name', async () => {
      const category = (await req.get('/categories')).body.results[0].id

      await req.post('/products')
        .set('Cookie', `token=${token}`)
        .send({
          name: 'New test',
          description: 'The new test',
          slug: 'the-new-test',
          price: 250,
          units: 300,
          category
        })
        .expect(400)
        .expect(/"error":/)
    })

    it('Should be able to create a temporary product for next tests', async () => {
      const existentProducts = (await req.get('/products')).body.results
      const category = (await req.get('/categories')).body.results[0].id

      if (existentProducts.find(product => product.slug === 'new-route-test')) {
        return expect(1).toEqual(1)
      }

      await req.post('/products')
        .set('Cookie', `token=${token}`)
        .send({
          name: 'Routes test',
          description: 'The new route test',
          slug: 'new-route-test',
          price: 255,
          units: 300,
          category
        })
        .expect(201)
        .expect(/"id":/)
    })

    it('Should be able to search product by price', async () => {
      const searchResponse = await req.get('/products?price=255')
        .expect(/"name":"Routes test"/)

      expect(searchResponse.body.results).toHaveLength(1)
    })

    it('Should be able to delete product', async () => {
      const reqResult = await req.get('/products')

      const createdProduct = reqResult.body.results.find(product => product.name === 'New test')

      await req.delete(`/products/${createdProduct.id}`)
        .set('Cookie', `token=${token}`)
        .expect(200)
    })
  })
}
