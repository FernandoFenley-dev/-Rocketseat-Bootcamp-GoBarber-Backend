import { container } from 'tsyringe';

// CHAMADA DAS INJEÇÕES DE DEPENDÊNCIAS DO 'HASH'
import '@modules/users/providers';

// CHAMADA DAS INJEÇÕES DE DEPENDÊNCIAS PARA OS PROVIDERS DA APLICAÇÃO (UPLOAD DE FOTO E ENVIO DE EMAIL)
import '@shared/container/providers/index';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppoinmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '@modules/users/repositories/IUsersTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

// registerSingleton: instancia a classe apenas uma única vez e as próximas requisições
// compartilharão as classes
container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository', // ID para a injeção
  AppointmentsRepository, // Classe para injeção
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository', // ID para a injeção
  UsersRepository, // Classe para injeção
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository', // ID para a injeção
  UserTokensRepository, // Classe para injeção
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository', // ID para a injeção
  NotificationsRepository, // Classe para injeção
);
