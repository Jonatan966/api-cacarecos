import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'

enum Status {
  AwaitingPayment = 'AWAITING_PAYMENT',
  PreparingDelivery = 'PREPARING_DELIVERY',
  OnDelivery = 'ON_DELIVERY',
  Finished = 'FINISHED',
  Canceled = 'CANCELED'
}

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

  @Column()
  status: Status;

  @Column()
  amount: number;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
