/* eslint-disable camelcase */
import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

// --- Rotas: receber a requisição, chamar um serviço tratar a requisição, devolver a resposta

// fazendo com q`ue todas as rotas de Appointments utilizem o middleware de autenticação
appointmentsRouter.use(ensureAuthenticated);

// o que é regra de negócio deve ser refatorado para um service
appointmentsRouter.post(
  '/',
  celebrate({
    // quando eu quero criar um objeto JS em que o nome de seus atributos é o valor de uma variável,
    // passamos o nome da vagiável entre conchetes: {[Segments.BODY]: 'test', age: 23},
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentsController.create,
);

appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
