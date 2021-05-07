import { Router } from 'express'

import { CategoryController } from '@controllers/CategoryController'
import { PermissionController } from '@controllers/PermissionController'
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

export { privateRoutes }
