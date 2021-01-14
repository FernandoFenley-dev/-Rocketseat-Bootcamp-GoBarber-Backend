/* eslint-disable no-useless-constructor */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppoinmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';

/*
  Recebimento das informações
  Tratativa de erros e exeções
  Acesso ao repositório
*/

// DTO
// interface para receber os dados da requisição
interface IRequest {
  date: Date;
  provider_id: string;
  user_id: string;
}

// Services armazenam as regras de negócio da aplicação

// cada serviço possui uma única funcionalidade
// o service nao possui acesso ao request e ao response
// sempre que o Service possuir uma dependência externa, essa dependência deve ser recebida como parâmetro do constructor
@injectable() // indica que a classe pode receber injeção de independências
class CreateAppointmentService {
  // No Typescript, ao criar o constructor dessa forma, estamos declarando o atributo
  // da classe e o instanciando ao mesmo tempo
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('You can not create an appointment on past date');
    }

    if (user_id === provider_id) {
      throw new AppError(
        'It is not allowed to create an appointment with yourself',
      );
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can only create appointments between 8pm and 5pm',
      );
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    // enviar a notificação
    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`,
    });

    // salvando em cache
    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
