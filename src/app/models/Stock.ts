import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Product } from './Product'
import { User } from './User'

@Entity('stocks')
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  units: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'registered_by' })
  registeredBy: User;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
