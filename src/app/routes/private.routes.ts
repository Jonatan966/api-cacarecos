import { Router } from 'express'

import { AuthController } from '@controllers/AuthController'
import { CategoryController } from '@controllers/CategoryController'
import { OrderController } from '@controllers/OrderController'
import { PermissionController } from '@controllers/PermissionController'
import { ProductController } from '@controllers/ProductController'
import { RatingController } from '@controllers/RatingController'
import { RoleController } from '@controllers/RoleController'
import { UserController } from '@controllers/UserController'
import { checkProductMiddleware } from '@middlewares/CheckProductMiddleware'

const privateRoutes = Router()

privateRoutes.post('/permissions', PermissionController.create)
privateRoutes.delete('/permissions/:id', PermissionController.remove)
privateRoutes.get('/permissions', PermissionController.index)

privateRoutes.post('/roles', RoleController.create)
privateRoutes.get('/roles', RoleController.index)
privateRoutes.delete('/roles/:id', RoleController.remove)
privateRoutes.patch('/roles/:id/permissions', RoleController.updateRolePermissions)

privateRoutes.post('/categories', CategoryController.create)
privateRoutes.delete('/categories/:id', CategoryController.remove)

privateRoutes.post('/products', ProductController.create)
privateRoutes.delete('/products/:id',
  checkProductMiddleware,
  ProductController.remove
)
privateRoutes.put('/products/:id', ProductController.update)

privateRoutes.post('/products/:productId/ratings',
  checkProductMiddleware,
  AuthController.validate,
  RatingController.create
)
privateRoutes.delete('/products/:productId/ratings/:ratingId',
  checkProductMiddleware,
  AuthController.validate,
  RatingController.remove
)

privateRoutes.get('/users', UserController.index)
privateRoutes.get('/users/:id', UserController.show)
privateRoutes.delete('/users/:id', UserController.remove)

privateRoutes.post('/orders',
  AuthController.validate,
  OrderController.create
)
privateRoutes.get('/orders',
  AuthController.validate,
  OrderController.index
)
privateRoutes.delete('/orders/:id',
  AuthController.validate,
  OrderController.remove
)

export { privateRoutes }
