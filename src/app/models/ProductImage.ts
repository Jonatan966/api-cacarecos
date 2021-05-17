import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { Product } from './Product'

@Entity('product_images')
export class ProductImage {
  @PrimaryColumn()
  id: string;

  @Column()
  url: string;

  @Column()
  primary: boolean;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
