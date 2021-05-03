import { connectToDatabase } from '../setup'
import { categoryModelTests } from './category'
import { orderModelTests } from './order'
import { permissionModelTests } from './permission'
import { productModelTests } from './product'
import { relationPermissionAndRoleTests } from './relation-permission-role'
import { relationProductAndCategory } from './relation-product-category'
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
categoryModelTests()
productModelTests()
relationProductAndCategory()
