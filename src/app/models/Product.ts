import { BeforeRemove, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { ImageUploadProvider } from '@providers/ImageUploadProvider'

import { Category } from './Category'
import { OrderProduct } from './OrderProduct'
import { ProductImage } from './ProductImage'
import { Rating } from './Rating'

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ select: false })
  description: string;

  @Column({ name: 'other_details', select: false })
  otherDetails: string;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.product)
  orderProducts: OrderProduct[];

  @OneToMany(() => ProductImage, productImage => productImage.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => Rating, rating => rating.product)
  ratings: Rating[];

  @Column()
  price: number;

  @Column({ select: false })
  units: number;

  @BeforeRemove()
  async removeProductImages () {
    await ImageUploadProvider.removeAll(this.id)
  }
}
