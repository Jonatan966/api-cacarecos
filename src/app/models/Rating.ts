import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Product } from './Product'
import { User } from './User'

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToOne(() => Product, product => product.ratings)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  stars: number;

  @Column()
  content: string;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
