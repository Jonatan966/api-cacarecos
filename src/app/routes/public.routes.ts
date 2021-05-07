import { Router } from 'express'

import { CategoryController } from '@controllers/CategoryController'

const publicRoutes = Router()

publicRoutes.get('/categories', CategoryController.index)
publicRoutes.get('/categories/:id', CategoryController.show)

export { publicRoutes }
