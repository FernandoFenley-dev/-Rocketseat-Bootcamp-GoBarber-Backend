/* eslint-disable camelcase */
// controllers devem possuir no máximo 5 métodos
// index, show, create, update, delete
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class UsersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const showProfile = container.resolve(ShowProfileService);
    const user = await showProfile.execute({ user_id });

    // delete user.password; // nao retornando a senha do usuário na resposta

    // utilizando o 'class-transformer' para nao retornar o password na rota
    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name, email, old_password, password } = request.body;
    const updateProfile = container.resolve(UpdateProfileService);
    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });

    // delete user.password; // nao retornando a senha do usuário na resposta

    // utilizando o 'class-transformer' para nao retornar o password na rota
    return response.json(classToClass(user));
  }
}
