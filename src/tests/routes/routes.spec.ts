import supertest from 'supertest'

import { app } from '../../app'
import { finishTests } from '../finishTests'
import { connectToDatabase } from '../setup'
import { userAdminCreation } from '../userAdminCreation'
import { authRoutesTests } from './auth'
import { categoryRoutesTests } from './category'
import { newsRoutesTests } from './news'
import { orderRoutesTests } from './order'
import { permissionRoutesTests } from './permission'
import { productRoutesTests } from './product'
import { ratingRoutesTests } from './rating'
import { roleRoutesTests } from './role'
import { stockRoutesTests } from './stock'
import { userRoutesTests } from './user'

const appRoutes = supertest(app)

beforeAll(connectToDatabase)

userAdminCreation()
permissionRoutesTests(appRoutes)
roleRoutesTests(appRoutes)
categoryRoutesTests(appRoutes)
productRoutesTests(appRoutes)
userRoutesTests(appRoutes)
authRoutesTests(appRoutes)
ratingRoutesTests(appRoutes)
orderRoutesTests(appRoutes)
stockRoutesTests(appRoutes)
newsRoutesTests(appRoutes)
finishTests()
