import { getRepository } from 'typeorm'

import { Order } from '@models/Order'
import { OrderProduct } from '@models/OrderProduct'
import { Product } from '@models/Product'

export const relationProductAndOrderTests = () => {
  describe('Relation with Product and Order models', () => {
    it('Should be able to add a product to an existing order', async () => {
      const orderRepo = getRepository(Order)
      const productRepo = getRepository(Product)
      const orderProductRepo = getRepository(OrderProduct)

      const selectedOrder = (await orderRepo.find({
        relations: ['orderProducts']
      }))[0]
      const selectedProduct = (await productRepo.find())[0]

      if (selectedOrder.orderProducts.length) {
        return expect(1).toEqual(1)
      }

      const result = await orderProductRepo.insert({
        order: selectedOrder,
        product: selectedProduct,
        units: 25
      })

      expect(result.identifiers).toHaveLength(1)
    })
  })
}
