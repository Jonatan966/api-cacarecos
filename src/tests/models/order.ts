import { getRepository } from 'typeorm'

import { Order, OrderStatus } from '@models/Order'
import { User } from '@models/User'

export const orderModelTests = () => {
  describe('Order Model tests', () => {
    let orderId = ''

    it('Should be able to insert a order', async () => {
      const orderRepository = getRepository(Order)
      const userRepository = getRepository(User)

      const user = await userRepository.findOne({
        email: 'alejandro@email.com'
      })

      const insertedOrder = await orderRepository.insert({
        owner: user,
        amount: 500,
        finishedBy: user,
        status: OrderStatus.AwaitingPayment
      })

      orderId = insertedOrder.raw[0]?.id

      expect(insertedOrder.raw).toHaveLength(1)
    })

    it('Should be able to find created order', async () => {
      const orderRepository = getRepository(Order)

      const order = await orderRepository.findOne(orderId)

      expect(order).toHaveProperty('id')
    })

    it('Should be able to delete order', async () => {
      const orderRepository = getRepository(Order)

      const order = await orderRepository.findOne(orderId)

      const result = await orderRepository.delete(order.id)

      expect(result).toHaveProperty('affected', 1)
    })

    it('Should be able to create a temporary order for next tests', async () => {
      const orderRepository = getRepository(Order)
      const userRepository = getRepository(User)

      const user = await userRepository.findOne({
        email: 'alejandro@email.com'
      })

      const orderAlreadyExists = await orderRepository.find()

      if (orderAlreadyExists.length) {
        expect(orderAlreadyExists).toHaveProperty('length', 1)
        return
      }

      const insertedOrder = await orderRepository.insert({
        owner: user,
        amount: 500,
        finishedBy: user,
        status: OrderStatus.AwaitingPayment
      })

      expect(insertedOrder.raw).toHaveLength(1)
    })
  })
}
