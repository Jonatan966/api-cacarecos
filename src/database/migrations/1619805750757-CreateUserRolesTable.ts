import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateUserRolesTable1619805750757 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'user_roles',
      columns: [
        {
          name: 'user_id',
          type: 'uuid',
          isPrimary: true
        },
        {
          name: 'role_id',
          type: 'uuid',
          isPrimary: true
        }
      ],
      foreignKeys: [
        {
          name: 'FKUserRoles_UserId',
          columnNames: ['user_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE'
        },
        {
          name: 'FKUserRoles_RoleId',
          columnNames: ['role_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'roles',
          onDelete: 'CASCADE'
        }
      ]
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_roles')
  }
}
