import { Router } from 'express'

import { CategoryController } from '@controllers/CategoryController'
import { ProductController } from '@controllers/ProductController'

const publicRoutes = Router()

publicRoutes.get('/categories', CategoryController.index)
publicRoutes.get('/categories/:id', CategoryController.show)

publicRoutes.get('/products', ProductController.index)
publicRoutes.get('/products/:id', ProductController.show)

export { publicRoutes }
