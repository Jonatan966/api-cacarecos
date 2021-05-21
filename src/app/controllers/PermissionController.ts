import { Request } from 'express'
import { getRepository } from 'typeorm'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useInsertOnlyNotExists } from '@hooks/useInsertOnlyNotExists'
import { AppControllerProps, NewResponse } from '@interfaces//Controller'
import { AutoBindClass } from '@interfaces/AutoBind'
import { Permission } from '@models/Permission'

class PermissionControllerClass extends AutoBindClass implements AppControllerProps {
  async create (req: Request, res: NewResponse) {
    const { name } = req.body

    const insertedPermission = await useInsertOnlyNotExists({ name }, Permission, { name })

    if (!insertedPermission) {
      return useErrorMessage('permission already exists', 400, res)
    }

    return res
      .status(201)
      .json(insertedPermission)
  }

  async remove (req: Request, res: NewResponse) {
    const { id } = req.params

    const permissionRepository = getRepository(Permission)

    const deleteResult = await permissionRepository.delete(id)

    if (deleteResult.affected) {
      return res
        .sendStatus(200)
    }

    return useErrorMessage('permission does not exists', 400, res)
  }

  async index (_req: Request, res: NewResponse) {
    const permissionRepository = getRepository(Permission)

    const permissions = await permissionRepository.find()

    return res.json(permissions)
  }
}

export const PermissionController = new PermissionControllerClass()
