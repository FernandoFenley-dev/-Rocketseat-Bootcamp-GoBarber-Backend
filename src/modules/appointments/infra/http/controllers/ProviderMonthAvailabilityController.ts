/* eslint-disable camelcase */
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year } = request.query;

    const ListProviderMonthAvailability = container.resolve(
      ListProviderMonthAvailabilityService,
    );

    // Rotas do tipo GET nao aceitam parâmetros via body da requisição
    // Por isso, devemos passar os parâmetros via 'query', pela URL
    // Os valores recebidos por parâmetro 'query' são strings
    // Portanto, é ncessário converter o valor
    const availability = await ListProviderMonthAvailability.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}
