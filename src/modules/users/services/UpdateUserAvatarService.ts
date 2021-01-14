/* eslint-disable no-useless-constructor */

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  userId: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ userId, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new AppError(
        'Only authenticated users are able to update the avatar',
        401,
      );
    }

    // deletar avatar anterior caso o usuário já possua um avatar cadastrado
    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    // atualizando o objeto do User com o caminho do seu novo avatar
    const fileName = await this.storageProvider.saveFile(avatarFilename);
    user.avatar = fileName;
    this.usersRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
