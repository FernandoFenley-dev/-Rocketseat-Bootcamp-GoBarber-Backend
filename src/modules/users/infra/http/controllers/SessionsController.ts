// controllers devem possuir no máximo 5 métodos
// index, show, create, update, delete
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    // aplicando as propriedades do classToClass nos objetos da classe 'User'
    // que serão retornados para o Front-end
    // Dessa forma, as instruções 'delete user.password;'
    // não são mais necessárias para exluir os atributos sensíveis antes de retornar os dados ao Front-end
    return response.json({ user: classToClass(user), token });
  }
}
