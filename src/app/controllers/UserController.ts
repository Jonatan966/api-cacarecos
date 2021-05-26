
import { Request } from 'express'
import { getRepository } from 'typeorm'
import { v4 as generateUUID } from 'uuid'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useHashString } from '@hooks/useHashString'
import { useInsertOnlyNotExists } from '@hooks/useInsertOnlyNotExists'
import { useObjectValidation } from '@hooks/useObjectValidation'
import { usePaginator } from '@hooks/usePaginator'
import { useResponseBuilder } from '@hooks/useResponseBuilder'
import { useSearchParams } from '@hooks/useSearchParams'
import { AppControllerProps, NewResponse } from '@interfaces//Controller'
import { AutoBindClass } from '@interfaces/AutoBind'
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
      ['id'],
      ['password', 'loginId', 'orders']
    )

    const users = await userRepository.find({ relations: ['roles'] })

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
}

export const UserController = new UserControllerClass()
