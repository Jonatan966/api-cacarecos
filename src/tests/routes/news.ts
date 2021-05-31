import request from 'supertest'

export const newsRoutesTests = (req: request.SuperTest<request.Test>) => {
  describe('News routes tests', () => {
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

    it('Should be able to insert a news', async () => {
      const productImage = (await req.get('/products')).body.results[0]
        .main_image.id

      await req.post('/news')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .send({
          title: 'news',
          body: 'a news',
          action_text: 'click here!',
          action_url: 'link.com',
          product_image: productImage
        })
        .expect(201)
        .expect(/"id":/)
    })

    it('Should be able to find created news', async () => {
      await req.get('/main-news')
        .expect(/"title":"news"/)
    })

    it('Should be able to create a temporary news for next tests', async () => {
      const existentNews = (await req.get('/main-news')).body

      if (existentNews.find(news => news.name === 'ROUTES_TEST')) {
        return expect(1).toEqual(1)
      }

      const productImage = (await req.get('/products')).body.results[0]
        .main_image.id

      await req.post('/news')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .send({
          title: 'unique news',
          body: 'a news',
          action_text: 'click here!',
          action_url: 'link.com',
          product_image: productImage
        })
        .expect(201)
        .expect(/"id":/)
    })

    it('Should be able to search news by title', async () => {
      const searchResponse = await req.get('/news?title=unique news')
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .expect(/"title":"unique news"/)

      expect(searchResponse.body.results).toHaveLength(1)
    })

    it('Should be able to delete news', async () => {
      const reqResult = await req.get('/main-news')

      const createdNews = reqResult.body.find(news => news.title === 'news')

      await req.delete(`/news/${createdNews.id}`)
        .set('Cookie', `cacarecos-access-token=Bearer ${token}`)
        .expect(200)
    })
  })
}
