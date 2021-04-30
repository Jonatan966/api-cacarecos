import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
