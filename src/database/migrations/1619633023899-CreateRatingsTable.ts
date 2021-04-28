import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateRatingsTable1619633023899 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    await queryRunner.createTable(new Table({
      name: 'ratings',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()'
        },
        {
          name: 'author_id',
          type: 'uuid',
          isNullable: false
        },
        {
          name: 'product_id',
          type: 'uuid',
          isNullable: false
        },
        {
          name: 'stars',
          type: 'integer',
          isNullable: false
        },
        {
          name: 'content',
          type: 'text',
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
          name: 'FKRatingAuthor',
          columnNames: ['author_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE'
        },
        {
          name: 'FKRatingProduct',
          columnNames: ['product_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'products',
          onDelete: 'CASCADE'
        }
      ]
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ratings')
    await queryRunner.query('DROP EXTENSION "uuid-ossp"')
  }
}
