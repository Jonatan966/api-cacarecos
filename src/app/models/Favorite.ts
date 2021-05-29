import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Product } from './Product'
import { User } from './User'

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
