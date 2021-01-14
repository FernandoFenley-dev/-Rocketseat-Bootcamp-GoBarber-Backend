/* eslint-disable camelcase */
import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentController {
  public async create(request: Request, response: Response): Promise<Response> {
    // recuperando o usuário logado
    const user_id = request.user.id;

    const { provider_id, date } = request.body;

    // não é necessário o parse pois o mesmo já foi feito durante a validação do 'celebrate'
    // const parsedDate = parseISO(date);

    // container.resolve
    const createAppointment = container.resolve(CreateAppointmentService);
    // const createAppointment = new CreateAppointmentService(appointmentsRepository);
    // não é mais necessário, pois fizemos a injeção de dependência

    const appointment = await createAppointment.execute({
      date,
      provider_id,
      user_id,
    });

    return response.json(appointment);
  }
}
