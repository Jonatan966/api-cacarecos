import { Router } from 'express'

import { AuthController } from '@controllers/AuthController'
import { CategoryController } from '@controllers/CategoryController'
import { ProductController } from '@controllers/ProductController'
import { RatingController } from '@controllers/RatingController'
import { UserController } from '@controllers/UserController'
import { RouteList } from '@interfaces/RouteList'
import { checkProductMiddleware } from '@middlewares/CheckProductMiddleware'
import { loadRoutes } from '@utils/loadRoutes'

const publicRoutes = Router()

const routes: RouteList = {
  '/categories': {
    get: CategoryController.index
  },
  '/categories/:id': {
    get: CategoryController.show
  },
  '/products': {
    get: ProductController.index
  },
  '/products/:id': {
    get: ProductController.show
  },
  '/products/:productId/ratings': {
    get: [
      checkProductMiddleware,
      RatingController.index
    ]
  },
  '/products/:productId/ratings/:ratingId': {
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
  '/auth/logout': {
    get: [
      AuthController.validate,
      AuthController.logOut
    ]
  }
}

loadRoutes(routes, publicRoutes)

export { publicRoutes }
