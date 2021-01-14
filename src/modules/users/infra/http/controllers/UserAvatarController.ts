// controllers devem possuir no máximo 5 métodos
// index, show, create, update, delete
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    // em request.file, obtemos todos os dados do arquivo que foi enviado
    // request.file.size: mostra o tamanho
    // request.file.mimetype: mostra o tipo de arquivo
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);
    const user = await updateUserAvatar.execute({
      userId: request.user.id,
      avatarFilename: request.file.filename,
    });
    delete user.password;
    return response.json(classToClass(user));
  }
}
