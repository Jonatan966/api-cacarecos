import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateClaimsTable1619633485901 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    await queryRunner.createTable(new Table({
      name: 'claims',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()'
        },
        {
          name: 'title',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'body',
          type: 'text',
          isNullable: false
        }
      ]
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('claims')
    await queryRunner.query('DROP EXTENSION "uuid-ossp"')
  }
}
