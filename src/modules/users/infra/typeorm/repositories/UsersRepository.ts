/* eslint-disable camelcase */
import { getRepository, Repository, Not } from 'typeorm';

import IUsersInterface from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

// DTO = Data Transfer Object
// Para transmitir dados de um arquivo para outro, é sempre melhor transferir objetos

// Persistência <-> Repositório <-> Rotas
// Repositório: conexao entre persistencia dos dados e as rotas
// Nos repositórios serão feitas as buscas aos banco e criação de novos objetos
// Há 1 repositório por model, que será responsável pelo CRUD

class UsersRepository implements IUsersInterface {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  // toda função async/await retorna uma Promise
  // por isso, devemos tipar o retorno da função como Promise
  // e depois colocar os possíveis valores de retorno da Promise: Appointment ou null
  // Ex: const response = await findByDate(date);
  // findByDate retorna uma Promise
  // response irá armazenar um Appointment ou null
  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });
    return user;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
      });
    } else {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
      });
    }
    return users;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const appointment = this.ormRepository.create(userData);
    await this.ormRepository.save(userData);
    return appointment;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
