import path from 'path'
import { RouteTest } from 'src/@types/RouteTest'

export const productRoutesTests: RouteTest = (req) => {
  describe('Product route tests', () => {
    it('Should be able to insert a product', async () => {
      const category = (await req.get('/categories')).body[0].id

      await req.post('/products')
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

    it('Should be able to view product by id', async () => {
      const productId = (await req.get('/products')).body[0].id

      await req.get(`/products/${productId}`)
        .expect(200)
        .expect(/"id":/)
    })

    it('Should be able to update product', async () => {
      const product = (await req.get('/products')).body
        .find(item => item.name === 'New test')

      await req
        .put(`/products/${product.id}`)
        .send({
          other_details: 'Um detalhe'
        })
        .expect(/"other_details":"Um detalhe"/)
    })

    it('Should not be able to create a product with the same name', async () => {
      const category = (await req.get('/categories')).body[0].id

      await req.post('/products')
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

    it('Should be able to delete product', async () => {
      const reqResult = await req.get('/products')

      const createdProduct = reqResult.body.find(product => product.name === 'New test')

      await req.delete(`/products/${createdProduct.id}`)
        .expect(200)
    })

    it('Should be able to create a temporary product for next tests', async () => {
      const existentProducts = (await req.get('/products')).body
      const category = (await req.get('/categories')).body[0].id

      if (existentProducts.find(product => product.slug === 'new-route-test')) {
        return expect(1).toEqual(1)
      }

      await req.post('/products')
        .send({
          name: 'Routes test',
          description: 'The new route test',
          slug: 'new-route-test',
          price: 250,
          units: 300,
          category
        })
        .expect(201)
        .expect(/"id":/)
    })
  })
}
