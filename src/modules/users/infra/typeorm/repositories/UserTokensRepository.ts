/* eslint-disable camelcase */
import { getRepository, Repository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUsersTokensRepository';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

class UsersTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  // toda função async/await retorna uma Promise
  // por isso, devemos tipar o retorno da função como Promise
  // e depois colocar os possíveis valores de retorno da Promise: Appointment ou null
  // Ex: const response = await findByDate(date);
  // findByDate retorna uma Promise
  // response irá armazenar um Appointment ou null
  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });
    return userToken;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user_id,
    });
    await this.ormRepository.save(userToken);
    return userToken;
  }
}

export default UsersTokensRepository;
