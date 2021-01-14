/* eslint-disable camelcase */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

/*
  Um para um (OneToOne)
  Um para Muitos (OneToMany)
  Muitos para Muitos (ManyToMany)
*/

@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  provider_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  @Column('varchar')
  user_id: string;

  // 'eager: true' permite SEMPRE trazer os dados do usuário correspondente ao appointment
  // @ManyToOne(() => User, { eager: true })
  // @ManyToOne(() => User, { lazy: true })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('time with time zone')
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // ao utilizar o ORM, os objetos criados a partir da entidade não srão via Constructor
  /*
  constructor({ provider, date }: Omit<Appointment, 'id'>) {
    this.id = uuid();
    this.provider = provider;
    this.date = date;
  }
  */
}

export default Appointment;
