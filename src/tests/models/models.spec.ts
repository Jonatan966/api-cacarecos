import 'reflect-metadata'

import { finishTests } from '../finishTests'
import { connectToDatabase } from '../setup'
import { categoryModelTests } from './category'
import { favoriteModelTests } from './favorite'
import { newsModelTests } from './news'
import { orderModelTests } from './order'
import { permissionModelTests } from './permission'
import { productModelTests } from './product'
import { productImageModelTests } from './product-image'
import { ratingModelTests } from './rating'
import { relationPermissionAndRoleTests } from './relation-permission-role'
import { relationProductAndCategory } from './relation-product-category'
import { relationProductAndOrderTests } from './relation-product-order'
import { relationRatingAndProductTests } from './relation-rating-product'
import { relationRatingAndUserTests } from './relation-rating-user'
import { relationUserAndOrder } from './relation-user-order'
import { relationUserAndRoleTests } from './relation-user-role'
import { roleModelTests } from './role'
import { stockModelTests } from './stock'
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
productImageModelTests()
stockModelTests()
favoriteModelTests()
newsModelTests()
finishTests()
