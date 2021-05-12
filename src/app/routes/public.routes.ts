import { Router } from 'express'

import { AuthController } from '@controllers/AuthController'
import { CategoryController } from '@controllers/CategoryController'
import { ProductController } from '@controllers/ProductController'
import { UserController } from '@controllers/UserController'

const publicRoutes = Router()

publicRoutes.get('/categories', CategoryController.index)
publicRoutes.get('/categories/:id', CategoryController.show)

publicRoutes.get('/products', ProductController.index)
publicRoutes.get('/products/:id', ProductController.show)

publicRoutes.post('/users', UserController.create)

publicRoutes.post('/auth/login', AuthController.logIn)
publicRoutes.get('/auth/logout', AuthController.validate, AuthController.logOut)

export { publicRoutes }
