import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateProductImagesTable1621294019129 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'product_images',
      columns: [
        {
          name: 'id',
          isPrimary: true,
          type: 'varchar'
        },
        {
          name: 'url',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'primary',
          type: 'boolean',
          isNullable: false,
          default: false
        },
        {
          name: 'product_id',
          type: 'uuid',
          isNullable: false
        }
      ],
      foreignKeys: [
        {
          name: 'FKProductImage',
          columnNames: ['product_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'products',
          onDelete: 'CASCADE'
        }
      ]
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('product_images')
  }
}
