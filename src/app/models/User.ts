import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
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

  @OneToMany(() => Order, order => order.owner)
  orders: Order[];

  @Column({ name: 'created_at', select: false })
  createdAt: Date;
}
