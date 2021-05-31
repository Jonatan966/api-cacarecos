import { getRepository } from 'typeorm'

import { News } from '@models/News'
import { ProductImage } from '@models/ProductImage'

export const newsModelTests = () => {
  describe('News Model', () => {
    it('Should be able to insert a news', async () => {
      const newsRepository = getRepository(News)
      const productImageRepository = getRepository(ProductImage)

      const insertedNews = await newsRepository.insert({
        title: 'test',
        body: 'um teste',
        actionText: 'Confira já',
        actionUrl: 'link.com',
        isMain: true,
        productImage: await productImageRepository.findOne('TEMP')
      })

      expect(insertedNews.raw).toHaveLength(1)
    })

    it('Should be able to find created news', async () => {
      const newsRepository = getRepository(News)

      const news = await newsRepository.findOne({
        where: {
          title: 'test'
        }
      })

      expect(news).toHaveProperty('body', 'um teste')
    })

    it('Should be able to edit news title', async () => {
      const newsRepository = getRepository(News)

      const news = await newsRepository.findOne({
        where: {
          title: 'test'
        }
      })

      const result = await newsRepository.update(news.id, {
        title: 'new test'
      })

      expect(result).toHaveProperty('affected', 1)
    })

    it('Should be able to delete news', async () => {
      const newsRepository = getRepository(News)

      const news = await newsRepository.findOne({
        where: {
          title: 'new test'
        }
      })

      const result = await newsRepository.delete(news.id)

      expect(result).toHaveProperty('affected', 1)
    })
  })
}
