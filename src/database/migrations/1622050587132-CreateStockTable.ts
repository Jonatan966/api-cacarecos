import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateStockTable1622050587132 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    await queryRunner.createTable(new Table({
      name: 'stocks',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          generationStrategy: 'uuid',
          isPrimary: true,
          default: 'uuid_generate_v4()'
        },
        {
          name: 'product_id',
          type: 'uuid',
          isNullable: false
        },
        {
          name: 'units',
          type: 'integer',
          isNullable: false
        },
        {
          name: 'registered_by',
          type: 'uuid',
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
          name: 'FKStockProduct',
          columnNames: ['product_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'products'
        },
        {
          name: 'FKStockOwner',
          columnNames: ['registered_by'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users'
        }
      ]
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('stocks')
    await queryRunner.query('DROP EXTENSION "uuid-ossp"')
  }
}
