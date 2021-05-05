import { Permission } from '@models/Permission'
import { useInsertOnlyNotExists } from '@hooks/useInsertOnlyNotExists'
import { Request, Response } from 'express'
import { useErrorMessage } from '@hooks/useErrorMessage'
import { getRepository } from 'typeorm'

export const PermissionController = {
  async create (req: Request, res: Response) {
    const { name } = req.body

    const insertedPermission = await useInsertOnlyNotExists({ name }, Permission, { name })

    if (!insertedPermission) {
      return useErrorMessage('permission already exists', 400, res)
    }

    return res
      .status(201)
      .json(insertedPermission)
  },

  async remove (req: Request, res: Response) {
    const { id } = req.params

    const permissionRepository = getRepository(Permission)

    const deleteResult = await permissionRepository.delete(id)

    if (deleteResult.affected) {
      return res
        .sendStatus(200)
    }

    return useErrorMessage('permission does not exists', 400, res)
  },

  async index (_req: Request, res: Response) {
    const permissionRepository = getRepository(Permission)

    const permissions = await permissionRepository.find()

    return res.json(permissions)
  }
}
