import { Order } from '@models/Order'
import { User } from '@models/User'
import { getRepository } from 'typeorm'

export const relationUserAndOrder = () => {
  describe('Relation with User and Order models', () => {
    it('Should be able to return orders when querying a user', async () => {
      const userRepository = getRepository(User)

      const user = await userRepository.findOne({
        email: 'alejandro@email.com'
      }, { relations: ['orders'] })

      expect(user.orders).toHaveLength(1)
    })

    it('Should be able to return user when querying a order', async () => {
      const orderRepository = getRepository(Order)

      const order = await orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.owner', 'owner')
        .select([
          'order',
          'owner.id'
        ])
        .getMany()

      expect(order[0].owner).toHaveProperty('id')
    })
  })
}
