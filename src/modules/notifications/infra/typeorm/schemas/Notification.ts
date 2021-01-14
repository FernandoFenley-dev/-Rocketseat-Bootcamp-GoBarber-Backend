/* eslint-disable camelcase */
import {
  ObjectID,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';

// No MondoDB, todos os valores padrão e configurações do banco devem ser feitas pela própria aplicação
// Não há um cli ou comandos que serão executados no banco
@Entity('notifications') // nome do Schema no MongoDB
export default class Notification {
  @ObjectIdColumn()
  id: ObjectID; // ID padrão armazenado no MongoDB

  @Column()
  content: string;

  @Column('uuid')
  recipient_id: string;

  @Column({ default: false }) // definindo o valor padrao do campo
  read: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
