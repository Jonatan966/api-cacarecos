import { connectToDatabase } from '../setup'
import { permissionModelTests } from './permission'
import { relationPermissionAndRoleTests } from './relation-permission-role'
import { roleModelTests } from './role'

beforeAll(connectToDatabase)

permissionModelTests()
roleModelTests()
relationPermissionAndRoleTests()
