import 'reflect-metadata'
import { connectToDatabase } from '../setup'
import { categoryModelTests } from './category'
import { orderModelTests } from './order'
import { permissionModelTests } from './permission'
import { productModelTests } from './product'
import { ratingModelTests } from './rating'
import { relationPermissionAndRoleTests } from './relation-permission-role'
import { relationProductAndCategory } from './relation-product-category'
import { relationProductAndOrderTests } from './relation-product-order'
import { relationRatingAndProductTests } from './relation-rating-product'
import { relationRatingAndUserTests } from './relation-rating-user'
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
relationProductAndOrderTests()
ratingModelTests()
relationRatingAndProductTests()
relationRatingAndUserTests()
