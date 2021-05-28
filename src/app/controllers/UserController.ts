
import { Request } from 'express'
import { getRepository } from 'typeorm'
import { v4 as generateUUID, validate as validateUUID } from 'uuid'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useHashString } from '@hooks/useHashString'
import { useInsertOnlyNotExists } from '@hooks/useInsertOnlyNotExists'
import { useObjectValidation } from '@hooks/useObjectValidation'
import { usePaginator } from '@hooks/usePaginator'
import { useResponseBuilder } from '@hooks/useResponseBuilder'
import { useSearchParams } from '@hooks/useSearchParams'
import { AppControllerProps, NewResponse } from '@interfaces//Controller'
import { AutoBindClass } from '@interfaces/AutoBind'
import { Role } from '@models/Role'
import { User } from '@models/User'

import { DefinePermissions } from '../decorators/DefinePermissions'
import { UserObjectSchema } from '../schemas/UserSchema'

class UserControllerClass extends AutoBindClass implements AppControllerProps {
  async create (req: Request, res: NewResponse) {
    const {
      $isError,
      ...body
    } = await useObjectValidation(req.body, UserObjectSchema)

    if ($isError) {
      return useErrorMessage('invalid fields', 400, res, {
        fields: body
      })
    }

    const userHashedPassword = await useHashString(body.password)

    const insertedUser = await useInsertOnlyNotExists({
      ...body,
      password: userHashedPassword,
      loginId: generateUUID()
    }, User, { email: body.email })

    if (!insertedUser) {
      return useErrorMessage('there is already a user with that email', 400, res)
    }

    delete insertedUser.password
    delete insertedUser.loginId

    return res.status(201)
      .json(insertedUser)
  }

  @DefinePermissions('REMOVE_USER')
  async remove (req: Request, res: NewResponse) {
    const { id } = req.params

    const userRepository = getRepository(User)

    const deleteResult = await userRepository.delete(id)

    if (deleteResult.affected) {
      return res
        .sendStatus(200)
    }

    return useErrorMessage('user does not exists', 400, res)
  }

  @DefinePermissions('LIST_USERS')
  async index (req: Request, res: NewResponse) {
    const userRepository = getRepository(User)

    const paginator = usePaginator(req.query)
    const searchParams = useSearchParams(req.query,
      userRepository,
      ['id', 'roles'],
      ['password', 'loginId', 'orders']
    )

    const users = await userRepository.find({
      ...paginator,
      where: searchParams,
      select: ['id', 'name', 'email', 'createdAt'],
      relations: ['roles']
    })

    const buildedResponse = await useResponseBuilder(
      users,
      paginator,
      searchParams,
      userRepository
    )

    return res.json(buildedResponse)
  }

  @DefinePermissions('SHOW_USER')
  async show (req: Request, res: NewResponse) {
    const { id } = req.params

    const userRepository = getRepository(User)

    const user = await userRepository.findOne(id, {
      relations: ['roles', 'orders'],
      select: ['id', 'name', 'email', 'createdAt']
    })

    if (user) {
      return res.status(200).json(user)
    }

    return useErrorMessage('user does not exists', 400, res)
  }

  async myProfile (_req: Request, res: NewResponse) {
    const userRepository = getRepository(User)

    const user = await userRepository.findOne(res.locals.user.id, {
      relations: ['roles', 'orders'],
      select: ['id', 'name', 'email', 'createdAt']
    })

    return res.status(200).json(user)
  }

  @DefinePermissions('UPDATE_USER')
  async updateRoles (req: Request, res: NewResponse) {
    const { roles } = req.body
    const { userId } = req.params

    if (!validateUUID(userId)) {
      return useErrorMessage('invalid user id', 400, res)
    }

    const userRepository = getRepository(User)

    const existingUser = await userRepository.findOne(userId)

    if (!existingUser) {
      return useErrorMessage('user not found', 400, res)
    }

    if (!Array.isArray(roles)) {
      return useErrorMessage('invalid fields', 400, res, {
        roles: 'missing field or in wrong format'
      })
    }

    const wrongRoles = roles.filter(role => !validateUUID(role))

    if (wrongRoles.length) {
      return useErrorMessage('invalid roles code', 400, res, {
        invalid_roles: wrongRoles
      })
    }

    if (roles.length) {
      const rolesRepository = getRepository(Role)

      const onlyExistingRoles = await rolesRepository.find({
        where: roles.map(role => ({
          id: role
        }))
      })

      if (onlyExistingRoles.length < roles.length) {
        return useErrorMessage('the following roles were not found', 400, res, {
          missing_roles: roles.filter(role =>
            !onlyExistingRoles.some(existingRole => existingRole.id === role)
          )
        })
      }

      existingUser.roles = onlyExistingRoles
    } else existingUser.roles = []

    const updatedUser = await userRepository.save(existingUser)

    if (!updatedUser) {
      return useErrorMessage('could not update user roles', 500, res)
    }

    return res.sendStatus(200)
  }
}

export const UserController = new UserControllerClass()
