import supertest from 'supertest'

import { app } from '../../app'
import { connectToDatabase } from '../setup'
import { authRoutesTests } from './auth'
import { categoryRoutesTests } from './category'
import { permissionRoutesTests } from './permission'
import { productRouteTests } from './product'
import { roleRoutesTests } from './role'
import { UserRouteTests } from './user'

const appRoutes = supertest(app)

beforeAll(connectToDatabase)

permissionRoutesTests(appRoutes)
roleRoutesTests(appRoutes)
categoryRoutesTests(appRoutes)
productRouteTests(appRoutes)
UserRouteTests(appRoutes)
authRoutesTests(appRoutes)
