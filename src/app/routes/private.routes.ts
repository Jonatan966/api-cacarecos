import { Router } from 'express'

import { AuthController } from '@controllers/AuthController'
import { CategoryController } from '@controllers/CategoryController'
import { OrderController } from '@controllers/OrderController'
import { PermissionController } from '@controllers/PermissionController'
import { ProductController } from '@controllers/ProductController'
import { RatingController } from '@controllers/RatingController'
import { RoleController } from '@controllers/RoleController'
import { StockController } from '@controllers/StockController'
import { UserController } from '@controllers/UserController'
import { RouteList } from '@interfaces/RouteList'
import { checkProductMiddleware } from '@middlewares/CheckProductMiddleware'
import { validateUUIDParams } from '@middlewares/ValidateUUIDParams'
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
    delete: [
      validateUUIDParams(),
      PermissionController.remove
    ]
  },
  '/roles': {
    post: RoleController.create,
    get: RoleController.index
  },
  '/roles/:id': {
    globalMiddlewares: validateUUIDParams(),
    delete: RoleController.remove,
    get: RoleController.show
  },
  '/roles/:id/permissions': {
    globalMiddlewares: validateUUIDParams(),
    patch: RoleController.updateRolePermissions
  },
  '/categories': {
    post: CategoryController.create
  },
  '/categories/:id': {
    globalMiddlewares: validateUUIDParams(),
    delete: CategoryController.remove
  },
  '/products': {
    post: [
      multerService.array('product_images', 4),
      ProductController.create
    ]
  },
  '/products/:id': {
    globalMiddlewares: validateUUIDParams(),
    delete: [
      checkProductMiddleware,
      ProductController.remove
    ],
    put: ProductController.update
  },
  '/products/:id/images': {
    globalMiddlewares: validateUUIDParams(),
    patch: [
      multerService.array('product_images', 4),
      ProductController.updateImages
    ]
  },
  '/products/:productId/ratings': {
    globalMiddlewares: validateUUIDParams(['productId']),
    post: [
      checkProductMiddleware,
      RatingController.create
    ]
  },
  '/products/:productId/ratings/:ratingId': {
    globalMiddlewares: validateUUIDParams(['productId', 'ratingId']),
    delete: [
      checkProductMiddleware,
      RatingController.remove
    ]
  },
  '/products/:productId/stock': {
    globalMiddlewares: validateUUIDParams(['productId']),
    patch: StockController.create,
    get: StockController.listProductStock
  },
  '/stock': {
    get: StockController.index
  },
  '/users': {
    get: UserController.index
  },
  '/users/me': {
    get: UserController.myProfile
  },
  '/users/:id': {
    globalMiddlewares: validateUUIDParams(),
    get: UserController.show,
    delete: UserController.remove
  },
  '/users/:userId/roles': {
    globalMiddlewares: validateUUIDParams(['userId']),
    patch: UserController.updateRoles
  },
  '/orders': {
    post: OrderController.create,
    get: OrderController.index
  },
  '/orders/:id': {
    globalMiddlewares: validateUUIDParams(),
    get: OrderController.show,
    delete: OrderController.remove
  },
  '/orders/:id/status': {
    globalMiddlewares: validateUUIDParams(),
    patch: OrderController.changeStatus
  },
  '/auth/logout': {
    get: AuthController.logOut
  }
}

loadRoutes(routes, privateRoutes)

export { privateRoutes }
