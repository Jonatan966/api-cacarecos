import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Favorite } from './Favorite'
import { Order } from './Order'
import { Role } from './Role'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ select: false })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ name: 'login_id', select: false })
  loginId: string;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id'
    }
  })
  roles: Role[];

  @OneToMany(() => Favorite, favorite => favorite.owner)
  favorites: Favorite[];

  @OneToMany(() => Order, order => order.owner)
  orders: Order[];

  @Column({ name: 'created_at', select: false })
  createdAt: Date;
}
