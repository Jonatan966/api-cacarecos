import { PermissionController } from '@controllers/PermissionController'
import { Router } from 'express'

const privateRoutes = Router()

privateRoutes.post('/permissions', PermissionController.create)
privateRoutes.delete('/permissions/:id', PermissionController.remove)
privateRoutes.get('/permissions', PermissionController.index)

export { privateRoutes }
