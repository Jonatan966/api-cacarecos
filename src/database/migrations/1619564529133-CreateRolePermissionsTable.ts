import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateRolePermissionsTable1619564529133 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    await queryRunner.createTable(new Table({
      name: 'role_permissions',
      columns: [
        {
          name: 'role_id',
          type: 'uuid',
          isPrimary: true
        },
        {
          name: 'permission_id',
          type: 'uuid',
          isPrimary: true
        }
      ],
      foreignKeys: [
        {
          name: 'FKRoleId',
          columnNames: ['role_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'roles',
          onDelete: 'CASCADE'
        },
        {
          name: 'FKPermissionId',
          columnNames: ['permission_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'permissions',
          onDelete: 'CASCADE'
        }
      ]
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('role_permissions')
    await queryRunner.query('DROP EXTENSION "uuid-ossp"')
  }
}
