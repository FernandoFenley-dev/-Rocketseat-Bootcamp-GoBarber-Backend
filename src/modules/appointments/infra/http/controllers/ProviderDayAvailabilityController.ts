/* eslint-disable camelcase */
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year, day } = request.query;

    const ListProviderDayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    );

    // Rotas do tipo GET nao aceitam parâmetros via body da requisição
    // Por isso, devemos passar os parâmetros via 'query', pela URL
    // Os valores recebidos por parâmetro 'query' são strings
    // Portanto, é ncessário converter o valor
    const availability = await ListProviderDayAvailability.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}
