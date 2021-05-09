import { Router } from 'express'

import { CategoryController } from '@controllers/CategoryController'
import { PermissionController } from '@controllers/PermissionController'
import { ProductController } from '@controllers/ProductController'
import { RoleController } from '@controllers/RoleController'

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
privateRoutes.delete('/products/:id', ProductController.remove)
privateRoutes.put('/products/:id', ProductController.update)

export { privateRoutes }
