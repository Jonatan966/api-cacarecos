import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateNewsTable1622394103645 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    await queryRunner.createTable(new Table({
      name: 'news',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
          isPrimary: true
        },
        {
          name: 'product_image',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'title',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'body',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'action_text',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'action_url',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'is_main',
          type: 'boolean',
          default: false
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
          name: 'FKNewsProductImage',
          columnNames: ['product_image'],
          referencedColumnNames: ['id'],
          referencedTableName: 'product_images',
          onDelete: 'SET NULL'
        }
      ]
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('news')
  }
}
