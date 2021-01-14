import 'reflect-metadata';

// importação do arquivo das variáveis ambiente
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors'; // deve ser importado logo após o express
import { errors } from 'celebrate';
import cors from 'cors';
import rateLimiter from '@shared/infra/http/middlewares/RateLimitter';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';

import '@shared/infra/typeorm'; // criando conexao com BD
import '@shared/container'; // iniciando injeção de dependências

const app = express();
app.use(rateLimiter);
app.use(cors());

app.use(express.json());

// criando uma rota para servir os arquivos de foto do backend para o frontend
app.use('/files', express.static(uploadConfig.uploadsFolder));

app.use(routes);

// Mensagens de erro de validação do celebrate
app.use(errors());

// os middlewares para tratativa de erros no express sao obrigados a receberem quatro parametros
app.use(
  // o padrão é receber "Next", porém colocamos "_" através do Eslint, pois "Next" era uma variável que não iriamos utilizar
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    // se o error for instancia da classe AppError
    // quer dizer que foi um erro gerado pela minha aplicação, um erro que eu conheço
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    console.log(error);

    // se for um erro que eu não conheço, um erro de sistema
    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(3333, () => {
  console.log(' ✔ Server has been successfully started on port 3333');
});
