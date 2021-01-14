import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  // este é o formato do token
  // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTcwNTEzNDMsImV4cCI6MTU5NzEzNzc0Mywic3ViIjoiZjAxZmRlMmItMmQ3Yy00YzJhLTgwZTQtYWE5MjIzZWNkOTgyIn0.Gjhw3Yv92Vx-D-lMu_VJokVYPCbUze-ZjYTzPxsSHZw

  // separando o espaço do "Bearer" e do "token"
  const [, token] = authHeader.split(' ');

  try {
    // queremos forçar um formato para o decoded para garantir que ele seja sempre um objeto
    const decoded = verify(token, authConfig.jwt.secret);

    // FORÇANDO QUE O DECODED SEJA SEMRE DO TIPO 'TokenPayLoad
    const { sub } = decoded as ITokenPayload;

    // anexando o id do usuário no objeto Request para que as rotas da aplicação compartilhem essa informação
    // para fazer isso, tivemos que criar o arquivo 'express.d.ts' na pasta '@types'
    request.user = {
      id: sub,
    };
    return next();
  } catch (error) {
    throw new AppError('Invalid JWT token', 401);
  }
}
