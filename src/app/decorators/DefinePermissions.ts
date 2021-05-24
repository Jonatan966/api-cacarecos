import { Request } from 'express'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { NewResponse } from '@interfaces/Controller'
import { Role } from '@models/Role'

export function DefinePermissions (...permissions: string[]) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = function (_req: Request, res: NewResponse) {
      const isAllowed = findPermission(res.locals.user?.roles ?? [], ...permissions)

      if (isAllowed) {
        return method.apply(this, [_req, res])
      }

      useErrorMessage('user without required permissions', 401, res)
    }
  }
}

export function findPermission (roles: Role[], ...permissions: string[]) {
  return !!roles.find(role =>
    role.permissions.find(permission =>
      permissions.includes(permission.name)
    )
  )
}
