/* eslint-disable camelcase */
/* eslint-disable no-useless-constructor */
import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isBefore } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppoinmentsRepository';

// import IUsersRepository from '@modules/users/repositories/IUsersRepository';

// import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    );
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    // criando um array com todos os dias de um mês: [1, 2, 3, 4, 5, 6 ... 28 ou 30 ou 31]
    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      // + 1, pois o primeiro dia do mês começa em 1 mas o 'index' da função se inicia em 0
      (value, index) => index + 1,
    );
    const availability = eachDayArray.map(day => {
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });
      return {
        day,
        // os agendamentos só serão possíveis das 8-17h, de 1 em 1 hora
        // deste modo, só serão possíveis 10 agendamentos por dia
        // Assim, se o provider tiver 10 agendamentos no dia, a resposta da rota será:
        // {day: 1, available: false}
        // Se o provider possuir menos de 10 agendamentos: {day: 1, available: true}
        available:
          appointmentsInDay.length < 10 &&
          !isBefore(new Date(year, month - 1, day, 23, 59, 59), new Date()),
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
