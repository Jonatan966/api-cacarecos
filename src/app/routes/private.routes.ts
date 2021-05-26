import { Router } from 'express'

import { AuthController } from '@controllers/AuthController'
import { CategoryController } from '@controllers/CategoryController'
import { OrderController } from '@controllers/OrderController'
import { PermissionController } from '@controllers/PermissionController'
import { ProductController } from '@controllers/ProductController'
import { RatingController } from '@controllers/RatingController'
import { RoleController } from '@controllers/RoleController'
import { UserController } from '@controllers/UserController'
import { RouteList } from '@interfaces/RouteList'
import { checkProductMiddleware } from '@middlewares/CheckProductMiddleware'
import { loadRoutes } from '@utils/loadRoutes'

import { multerService } from '../services/multer'

const privateRoutes = Router()

privateRoutes.use(
  AuthController.validate
)

const routes: RouteList = {
  '/permissions': {
    post: PermissionController.create,
    get: PermissionController.index
  },
  '/permissions/:id': {
    delete: PermissionController.remove
  },
  '/roles': {
    post: RoleController.create,
    get: RoleController.index
  },
  '/roles/:id': {
    delete: RoleController.remove
  },
  '/roles/:id/permissions': {
    patch: RoleController.updateRolePermissions
  },
  '/categories': {
    post: CategoryController.create
  },
  '/categories/:id': {
    delete: CategoryController.remove
  },
  '/products': {
    post: [
      multerService.array('product_images', 4),
      ProductController.create
    ]
  },
  '/products/:id': {
    delete: [
      checkProductMiddleware,
      ProductController.remove
    ],
    put: ProductController.update
  },
  '/products/:id/images': {
    patch: [
      multerService.array('product_images', 4),
      ProductController.updateImages
    ]
  },
  '/products/:productId/ratings': {
    post: [
      checkProductMiddleware,
      RatingController.create
    ]
  },
  '/products/:productId/ratings/:ratingId': {
    delete: [
      checkProductMiddleware,
      RatingController.remove
    ]
  },
  '/users': {
    get: UserController.index
  },
  '/users/me': {
    get: UserController.myProfile
  },
  '/users/:id': {
    get: UserController.show,
    delete: UserController.remove
  },
  '/users/:userId/roles': {
    patch: UserController.updateRoles
  },
  '/orders': {
    post: OrderController.create,
    get: OrderController.index
  },
  '/orders/:id': {
    delete: OrderController.remove
  },
  '/orders/:id/status': {
    patch: OrderController.changeStatus
  }
}

loadRoutes(routes, privateRoutes)

export { privateRoutes }
