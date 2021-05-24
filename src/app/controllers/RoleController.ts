import { Request } from 'express'
import { getRepository } from 'typeorm'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useInsertOnlyNotExists } from '@hooks/useInsertOnlyNotExists'
import { useObjectValidation } from '@hooks/useObjectValidation'
import { usePaginator } from '@hooks/usePaginator'
import { useResponseBuilder } from '@hooks/useResponseBuilder'
import { useSearchParams } from '@hooks/useSearchParams'
import { AutoBindClass } from '@interfaces/AutoBind'
import { AppControllerProps, NewResponse } from '@interfaces/Controller'
import { Permission } from '@models/Permission'
import { Role } from '@models/Role'

import { DefinePermissions } from '../decorators/DefinePermissions'
import { RoleObjectSchema } from '../schemas/RoleSchema'

class RoleControllerClass extends AutoBindClass implements AppControllerProps {
  @DefinePermissions('ADD_ROLE')
  async create (req: Request, res: NewResponse) {
    const { name, permissions, $isError } = await useObjectValidation(req.body, RoleObjectSchema)
    const permissionRepo = getRepository(Permission)

    if ($isError) {
      return useErrorMessage('invalid fields', 400, res, {
        fields: { name, permissions }
      })
    }

    const onlyExistingPermissions = await permissionRepo.find({
      where: permissions.map(permission => ({ id: permission }))
    })

    const insertResult = await useInsertOnlyNotExists({
      name,
      permissions: onlyExistingPermissions
    }, Role, { name })

    if (!insertResult) {
      return useErrorMessage('permission already exists', 400, res)
    }

    return res
      .status(201)
      .json(insertResult)
  }

  @DefinePermissions('VIEW_ROLES')
  async index (req: Request, res: NewResponse) {
    const roleRepository = getRepository(Role)

    const paginator = usePaginator(req.query)
    const searchParams = useSearchParams(
      req.query,
      roleRepository,
      ['id'],
      ['permissions']
    )

    const roles = await roleRepository.find({
      ...paginator,
      relations: ['permissions'],
      where: searchParams
    })

    const buildedResponse = await useResponseBuilder(
      roles,
      paginator,
      searchParams,
      roleRepository
    )

    return res.json(buildedResponse)
  }

  @DefinePermissions('REMOVE_ROLE')
  async remove (req: Request, res: NewResponse) {
    const { id } = req.params

    const roleRepository = getRepository(Role)

    const deleteResult = await roleRepository.delete(id)

    if (deleteResult.affected) {
      return res
        .sendStatus(200)
    }

    return useErrorMessage('role does not exists', 400, res)
  }

  @DefinePermissions('EDIT_ROLE')
  async updateRolePermissions (req: Request, res: NewResponse) {
    const roleRepository = getRepository(Role)
    const permissionRepository = getRepository(Permission)

    const { id } = req.params
    const { permissions, $isError } = await useObjectValidation(req.body, {
      ...RoleObjectSchema,
      YupSchema: RoleObjectSchema.YupSchema.omit(['name'])
    })

    if ($isError) {
      return useErrorMessage('invalid fields', 400, res, {
        fields: { permissions }
      })
    }

    const findedRole = await roleRepository.findOne(id)

    if (!findedRole) {
      return useErrorMessage('role does not exists', 400, res)
    }

    const onlyExistingPermissions = await permissionRepository.find({
      where: permissions.map(permission => ({ id: permission }))
    })

    findedRole.permissions = onlyExistingPermissions

    await roleRepository.save(findedRole)

    return res.status(200).json(findedRole)
  }
}

export const RoleController = new RoleControllerClass()
