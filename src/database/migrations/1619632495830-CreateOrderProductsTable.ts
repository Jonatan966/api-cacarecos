import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateOrderProductsTable1619632495830 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'order_products',
      columns: [
        {
          name: 'product_id',
          type: 'uuid',
          isPrimary: true
        },
        {
          name: 'order_id',
          type: 'uuid',
          isPrimary: true
        },
        {
          name: 'units',
          type: 'integer',
          isNullable: false
        }
      ],
      foreignKeys: [
        {
          name: 'FKOrderProductId',
          columnNames: ['product_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'products'
        },
        {
          name: 'FKOrderId',
          columnNames: ['order_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'orders',
          onDelete: 'CASCADE'
        }
      ]
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('order_products')
  }
}
