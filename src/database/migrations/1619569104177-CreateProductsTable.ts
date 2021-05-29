import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateProductsTable1619569104177 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    await queryRunner.createTable(new Table({
      name: 'products',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()'
        },
        {
          name: 'name',
          type: 'varchar',
          isUnique: true,
          isNullable: false
        },
        {
          name: 'slug',
          type: 'varchar',
          isUnique: true,
          isNullable: false
        },
        {
          name: 'description',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'other_details',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'price',
          type: 'numeric',
          isNullable: false
        },
        {
          name: 'category_id',
          type: 'uuid',
          isNullable: false
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()'
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()'
        }
      ],
      foreignKeys: [
        {
          name: 'FKProductCategory',
          columnNames: ['category_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'categories'
        }
      ]
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products')
    await queryRunner.query('DROP EXTENSION "uuid-ossp"')
  }
}
