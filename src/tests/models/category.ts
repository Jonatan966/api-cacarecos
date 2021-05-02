import { Category } from '@models/Category'
import { getRepository } from 'typeorm'

export const categoryModelTests = () => {
  describe('Category Model', () => {
    it('Should be able to insert a category', async () => {
      const categoryRepository = getRepository(Category)

      const insertedCategory = await categoryRepository.insert({
        name: 'Cozinha',
        color: '#e8e87d'
      })

      expect(insertedCategory.raw).toHaveLength(1)
    })

    it('Should be able to find created category', async () => {
      const categoryRepository = getRepository(Category)

      const category = await categoryRepository.findOne({
        where: {
          name: 'Cozinha'
        }
      })

      expect(category).toHaveProperty('name', 'Cozinha')
    })

    it('Should not be able to create a category with the same name', async () => {
      const categoryRepository = getRepository(Category)

      try {
        const duplicatedCategory = await categoryRepository.insert({
          name: 'Cozinha',
          color: '#e8e87d'
        })

        expect(duplicatedCategory.raw).toHaveLength(0)
      } catch (err) {
        expect(err).toHaveProperty('code', '23505') // duplicate key value error
      }
    })

    it('Should be able to edit category name', async () => {
      const categoryRepository = getRepository(Category)

      const category = await categoryRepository.findOne({
        where: {
          name: 'Cozinha'
        }
      })

      const result = await categoryRepository.update(category, {
        name: 'Lazer'
      })

      expect(result).toHaveProperty('affected', 1)
    })

    it('Should be able to delete category', async () => {
      const categoryRepository = getRepository(Category)

      const category = await categoryRepository.findOne({
        where: {
          name: 'Lazer'
        }
      })

      const result = await categoryRepository.delete(category)

      expect(result).toHaveProperty('affected', 1)
    })

    it('Should be able to create a temporary category for next tests', async () => {
      const categoryRepository = getRepository(Category)

      const categoryAlreadyExists = await categoryRepository.findOne({
        name: 'Quarto'
      })

      if (categoryAlreadyExists?.id) {
        expect(categoryAlreadyExists).toHaveProperty('id')
        return
      }

      const insertedCategory = await categoryRepository.insert({
        name: 'Quarto',
        color: '#93e67a'
      })

      expect(insertedCategory.raw).toHaveLength(1)
    })
  })
}
