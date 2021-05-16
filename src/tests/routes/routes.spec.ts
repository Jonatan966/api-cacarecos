import supertest from 'supertest'

import { app } from '../../app'
import { connectToDatabase } from '../setup'
import { authRoutesTests } from './auth'
import { categoryRoutesTests } from './category'
import { orderRoutesTests } from './order'
import { permissionRoutesTests } from './permission'
import { productRoutesTests } from './product'
import { ratingRoutesTests } from './rating'
import { roleRoutesTests } from './role'
import { userRoutesTests } from './user'

const appRoutes = supertest(app)

beforeAll(connectToDatabase)

permissionRoutesTests(appRoutes)
roleRoutesTests(appRoutes)
categoryRoutesTests(appRoutes)
productRoutesTests(appRoutes)
userRoutesTests(appRoutes)
authRoutesTests(appRoutes)
ratingRoutesTests(appRoutes)
orderRoutesTests(appRoutes)
