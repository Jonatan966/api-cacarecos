import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { OrderProduct } from './OrderProduct'
import { User } from './User'

export enum OrderStatus {
  AwaitingPayment = 'AWAITING_PAYMENT',
  PreparingDelivery = 'PREPARING_DELIVERY',
  OnDelivery = 'ON_DELIVERY',
  Finished = 'FINISHED',
  Canceled = 'CANCELED'
}

export type OrderStatusKeys = 'AwaitingPayment'
  | 'PreparingDelivery'
  | 'OnDelivery'
  | 'Finished'
  | 'Canceled'

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'finished_by' })
  finishedBy: User;

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.order)
  orderProducts: OrderProduct[];

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column()
  amount: number;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
