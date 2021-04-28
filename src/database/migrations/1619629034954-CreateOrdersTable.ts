import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateOrdersTable1619629034954 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    await queryRunner.createTable(new Table({
      name: 'orders',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()'
        },
        {
          name: 'owner_id',
          type: 'uuid',
          isNullable: false
        },
        {
          name: 'finished_by',
          type: 'uuid',
          isNullable: true
        },
        {
          name: 'status',
          type: 'enum',
          enum: ['AWAITING_PAYMENT', 'PREPARING_DELIVERY', 'ON_DELIVERY', 'FINISHED', 'CANCELED'],
          isNullable: true,
          default: "'AWAITING_PAYMENT'"
        },
        {
          name: 'amount',
          type: 'numeric',
          isNullable: false
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
          isNullable: true
        }
      ],
      foreignKeys: [
        {
          name: 'FKOrderOwner',
          columnNames: ['owner_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users'
        },
        {
          name: 'FKOrderEmployee',
          columnNames: ['finished_by'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users'
        }
      ]
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders')
    await queryRunner.query('DROP EXTENSION "uuid-ossp"')
  }
}
