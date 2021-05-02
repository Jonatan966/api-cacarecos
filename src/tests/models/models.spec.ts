import { connectToDatabase } from '../setup'
import { orderModelTests } from './order'
import { permissionModelTests } from './permission'
import { relationPermissionAndRoleTests } from './relation-permission-role'
import { relationUserAndOrder } from './relation-user-order'
import { relationUserAndRoleTests } from './relation-user-role'
import { roleModelTests } from './role'
import { userModelTests } from './user'

beforeAll(connectToDatabase)

permissionModelTests()
roleModelTests()
relationPermissionAndRoleTests()
userModelTests()
relationUserAndRoleTests()
orderModelTests()
relationUserAndOrder()
