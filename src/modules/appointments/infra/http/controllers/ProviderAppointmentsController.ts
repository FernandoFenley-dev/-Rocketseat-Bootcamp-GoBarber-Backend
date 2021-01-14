/* eslint-disable camelcase */
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderApppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    // recuperando o usuário logado
    const provider_id = request.user.id;

    const { day, month, year } = request.query;

    // container.resolve
    const listProviderAppointments = container.resolve(
      ListProviderAppointmentsService,
    );
    // const createAppointment = new CreateAppointmentService(appointmentsRepository);
    // não é mais necessário, pois fizemos a injeção de dependência

    // Rotas do tipo GET nao aceitam parâmetros via body da requisição
    // Por isso, devemos passar os parâmetros via 'query', pela URL
    // Os valores recebidos por parâmetro 'query' são strings
    // Portanto, é ncessário converter o valor
    const appointments = await listProviderAppointments.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    // fazendo a serelização do objeto Appointment no retorno dos dados
    return response.json(classToClass(appointments));
  }
}
