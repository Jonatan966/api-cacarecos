import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { Order } from './Order'
import { Product } from './Product'

@Entity('order_products')
export class OrderProduct {
  @ManyToOne(() => Order, order => order.orderProducts, { primary: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, product => product.orderProducts, { primary: true, eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  units: number;
}
