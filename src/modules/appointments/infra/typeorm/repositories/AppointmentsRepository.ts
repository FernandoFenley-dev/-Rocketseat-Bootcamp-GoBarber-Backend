/* eslint-disable camelcase */
import { getRepository, Repository, Raw } from 'typeorm';

import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import IAppointmentsInterface from '@modules/appointments/repositories/IAppoinmentsRepository';
import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

// DTO = Data Transfer Object
// Para transmitir dados de um arquivo para outro, é sempre melhor transferir objetos

// Persistência <-> Repositório <-> Rotas
// Repositório: conexao entre persistencia dos dados e as rotas
// Nos repositórios serão feitas as buscas aos banco e criação de novos objetos
// Há 1 repositório por model, que será responsável pelo CRUD

class AppointmentsRepository implements IAppointmentsInterface {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  // toda função async/await retorna uma Promise
  // por isso, devemos tipar o retorno da função como Promise
  // e depois colocar os possíveis valores de retorno da Promise: Appointment ou null
  // Ex: const response = await findByDate(date);
  // findByDate retorna uma Promise
  // response irá armazenar um Appointment ou null
  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: {
        date,
        provider_id,
      },
    });

    return findAppointment;
  }

  public async findAllInDayFromProvider({
    provider_id,
    month,
    year,
    day,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    // No JS, o número do mês não possui zero na frente. Ex: 1, 2
    // Para a função RAW do mês, ele trata com o zero na frente do mês. Ex: 01, 02
    // Por isso, estamos realizando um parse do numero do mês do JS
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,

        // -- também é possível utilizar o between do date-fns
        // https://www.postgresql.org/docs/10/functions-formatting.html
        // Raw() do typeorm: comando informado na função Raw() não será interpretado pelo ORM, será interpretado direto pelo banco de dados
        // 'to_char' é uma função do Postgres para converter objetos do JS para serem salvos com um formato especifico no banco
        // Raw() do typeorm recebe uma função como parâmetro
        // Como o Typeorm muda o nome das colunas durante seu processamento, estamos recebendo
        // o nome da coluna gerado pelo typeorm através de 'dateFieldName'
        date: Raw(
          dateFieldName =>
            // 'MM-YYYY' é o padrão que queremos que o objeto JS seja convertido no banco
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      relations: ['user'], // para trazer os dados do usuário correspondente ao appointment
    });
    return appointments;
  }

  public async findAllInMonthFromProvider({
    year,
    month,
    provider_id,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    // No JS, o número do mês não possui zero na frente. Ex: 1, 2
    // Para a função RAW do mês, ele trata com o zero na frente do mês. Ex: 01, 02
    // Por isso, estamos realizando um parse do numero do mês do JS
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,

        // -- também é possível utilizar o between do date-fns
        // https://www.postgresql.org/docs/10/functions-formatting.html
        // Raw() do typeorm: comando informado na função Raw() não será interpretado pelo ORM, será interpretado direto pelo banco de dados
        // 'to_char' é uma função do Postgres para converter objetos do JS para serem salvos com um formato especifico no banco
        // Raw() do typeorm recebe uma função como parâmetro
        // Como o Typeorm muda o nome das colunas durante seu processamento, estamos recebendo
        // o nome da coluna gerado pelo typeorm através de 'dateFieldName'
        date: Raw(dateFieldName => {
          console.log(dateFieldName);
          // 'MM-YYYY' é o padrão que queremos que o objeto JS seja convertido no banco
          return `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`;
        }),
      },
    });
    return appointments;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentsDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      date,
      user_id,
    });
    await this.ormRepository.save(appointment);
    return appointment;
  }
}

export default AppointmentsRepository;
