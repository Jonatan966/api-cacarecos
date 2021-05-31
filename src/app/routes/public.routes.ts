import { Router } from 'express'

import { AuthController } from '@controllers/AuthController'
import { CategoryController } from '@controllers/CategoryController'
import { NewsController } from '@controllers/NewsController'
import { ProductController } from '@controllers/ProductController'
import { RatingController } from '@controllers/RatingController'
import { UserController } from '@controllers/UserController'
import { RouteList } from '@interfaces/RouteList'
import { checkProductMiddleware } from '@middlewares/CheckProductMiddleware'
import { validateUUIDParams } from '@middlewares/ValidateUUIDParams'
import { loadRoutes } from '@utils/loadRoutes'

const publicRoutes = Router()

const routes: RouteList = {
  '/categories': {
    get: CategoryController.index
  },
  '/categories/:id': {
    globalMiddlewares: validateUUIDParams(),
    get: CategoryController.show
  },
  '/products': {
    get: ProductController.index
  },
  '/products/:id': {
    globalMiddlewares: validateUUIDParams(),
    get: ProductController.show
  },
  '/products/:productId/ratings': {
    globalMiddlewares: validateUUIDParams(['productId']),
    get: [
      checkProductMiddleware,
      RatingController.index
    ]
  },
  '/products/:productId/ratings/:ratingId': {
    globalMiddlewares: validateUUIDParams(['productId', 'ratingId']),
    get: [
      checkProductMiddleware,
      RatingController.show
    ]
  },
  '/users': {
    post: UserController.create
  },
  '/auth/login': {
    post: AuthController.logIn
  },
  '/main-news': {
    get: NewsController.index
  }
}

loadRoutes(routes, publicRoutes)

export { publicRoutes }
