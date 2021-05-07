import supertest from 'supertest'

import { app } from '../../app'
import { connectToDatabase } from '../setup'
import { categoryRoutesTests } from './category'
import { permissionRoutesTests } from './permission'
import { roleRoutesTests } from './role'

const appRoutes = supertest(app)

beforeAll(connectToDatabase)

permissionRoutesTests(appRoutes)
roleRoutesTests(appRoutes)
categoryRoutesTests(appRoutes)
