import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateFavoritesTable1622323570589 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    await queryRunner.createTable(new Table({
      name: 'favorites',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
          isPrimary: true
        },
        {
          name: 'product_id',
          type: 'uuid',
          isNullable: false
        },
        {
          name: 'owner_id',
          type: 'uuid',
          isNullable: false
        }
      ],
      foreignKeys: [
        {
          name: 'FKOwnerFavorite',
          columnNames: ['owner_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE'
        },
        {
          name: 'FKProductFavorite',
          columnNames: ['product_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'products',
          onDelete: 'CASCADE'
        }
      ]
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('favorites')
  }
}
