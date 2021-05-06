import supertest from 'supertest'

import { app } from '../../app'
import { connectToDatabase } from '../setup'
import { permissionRoutesTests } from './permission'

const appRoutes = supertest(app)

beforeAll(connectToDatabase)

permissionRoutesTests(appRoutes)
