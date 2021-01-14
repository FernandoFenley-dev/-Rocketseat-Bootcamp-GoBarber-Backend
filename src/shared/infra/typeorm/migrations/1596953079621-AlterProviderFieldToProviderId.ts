/* eslint-disable class-methods-use-this */
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AlterProviderFieldToProviderId1596953079621
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('appointments', 'provider');
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'provider_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        name: 'AppointmentProvider',
        columnNames: ['provider_id'], // qual a coluna que receberá a chave estrangeira na tabela Appointments
        referencedColumnNames: ['id'], // qual a coluna na tabela usuário que representará o provider_id
        referencedTableName: 'users', // qual a tabela que fará a referência desse campo
        onDelete: 'SET NULL', // RESTRICT, SET NULL, CASCADE
        onUpdate: 'CASCADE', // se o usuário tiver seu ID alterado, a alteração refletirá nos seus relacionamentos
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // os métodos down devem fazer EXATAMENTE o contrário que o método up

    // se primeiramente o método up criou uma FK, o método down irá excluí-la
    await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');

    // se depois o método up criou uma coluna na tabela, o método down irá excluí-la
    await queryRunner.dropColumn('appointments', 'provider_id');

    // por fim, se o método up deletou uma coluna, o método down a recria novamente
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'provider',
        type: 'varchar',
        // isNullable: false, ** por padrão, as colunas já são isNullable: false
      }),
    );
  }
}
