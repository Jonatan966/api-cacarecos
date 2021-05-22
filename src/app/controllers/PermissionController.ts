import { Request } from 'express'
import { getRepository } from 'typeorm'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useInsertOnlyNotExists } from '@hooks/useInsertOnlyNotExists'
import { useObjectValidation } from '@hooks/useObjectValidation'
import { usePaginator } from '@hooks/usePaginator'
import { useResponseBuilder } from '@hooks/useResponseBuilder'
import { useSearchParams } from '@hooks/useSearchParams'
import { AppControllerProps, NewResponse } from '@interfaces//Controller'
import { AutoBindClass } from '@interfaces/AutoBind'
import { Permission } from '@models/Permission'

import { PermissionObjectSchema } from '../schemas/PermissionSchema'

class PermissionControllerClass extends AutoBindClass implements AppControllerProps {
  async create (req: Request, res: NewResponse) {
    const { name, $isError } = await useObjectValidation(req.body, PermissionObjectSchema)

    if ($isError) {
      return useErrorMessage('invalid fields', 400, res, {
        fields: { name }
      })
    }

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

  async index (req: Request, res: NewResponse) {
    const permissionRepository = getRepository(Permission)

    const paginator = usePaginator(req.query)
    const searchParams = useSearchParams(req.query, permissionRepository, ['id'])

    const permissions = await permissionRepository.find({
      ...paginator,
      where: searchParams
    })

    const buildedResponse = await useResponseBuilder(
      permissions,
      paginator,
      searchParams,
      permissionRepository
    )

    return res.json(buildedResponse)
  }
}

export const PermissionController = new PermissionControllerClass()
