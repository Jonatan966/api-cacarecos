import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { ProductImage } from './ProductImage'

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ name: 'action_text' })
  actionText: string;

  @Column({ name: 'action_url' })
  actionUrl: string;

  @ManyToOne(() => ProductImage)
  @JoinColumn({ name: 'product_image' })
  productImage: ProductImage;

  @Column({ name: 'is_main' })
  isMain: boolean;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
