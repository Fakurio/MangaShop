import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

export enum RoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
  name: RoleEnum;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
