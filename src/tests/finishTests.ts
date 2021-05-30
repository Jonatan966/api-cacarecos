import { getManager } from 'typeorm'

export const finishTests = () => {
  describe('Finish models tests', () => {
    it('Delete created rating', async () => {
      const result = await getManager().query('DELETE FROM ratings')

      expect(result).toHaveLength(2)
    })

    it('Delete created order', async () => {
      await getManager().query('DELETE FROM order_products')
      const result = await getManager().query('DELETE FROM orders')

      expect(result).toHaveLength(2)
    })

    it('Delete created product', async () => {
      const result = await getManager().query('DELETE FROM products')

      expect(result).toHaveLength(2)
    })

    it('Delete created user', async () => {
      const result = await getManager().query('DELETE FROM users')

      expect(result).toHaveLength(2)
    })

    it('Delete created role', async () => {
      const result = await getManager().query('DELETE FROM roles')

      expect(result).toHaveLength(2)
    })

    it('Delete created permission', async () => {
      const result = await getManager().query('DELETE FROM permissions')

      expect(result).toHaveLength(2)
    })

    it('Delete created stock', async () => {
      const result = await getManager().query('DELETE FROM stocks')

      expect(result).toHaveLength(2)
    })

    it('Delete created news', async () => {
      const result = await getManager().query('DELETE FROM news')

      expect(result).toHaveLength(2)
    })
  })
}
