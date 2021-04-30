import { connectToDatabase } from '../setup'
import { permissionModelTests } from './permission'
import { relationPermissionAndRoleTests } from './relation-permission-role'
import { relationUserAndRoleTests } from './relation-user-role'
import { roleModelTests } from './role'
import { userModelTests } from './user'

beforeAll(connectToDatabase)

permissionModelTests()
roleModelTests()
relationPermissionAndRoleTests()
userModelTests()
relationUserAndRoleTests()
