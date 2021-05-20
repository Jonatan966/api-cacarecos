
import { Request } from 'express'
import { getRepository } from 'typeorm'
import { v4 as generateUUID } from 'uuid'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useHashString } from '@hooks/useHashString'
import { useInsertOnlyNotExists } from '@hooks/useInsertOnlyNotExists'
import { useObjectValidation } from '@hooks/useObjectValidation'
import { AppControllerProps, NewResponse } from '@interfaces//Controller'
import { AutoBindClass } from '@interfaces/AutoBind'
import { User } from '@models/User'

import { UserSchemaProps, UserSchema } from '../schemas/UserSchema'

class UserControllerClass extends AutoBindClass implements AppControllerProps {
  async create (req: Request, res: NewResponse) {
    const {
      $isError,
      ...body
    } = await useObjectValidation<UserSchemaProps>(req.body, UserSchema)

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

  async index (_req: Request, res: NewResponse) {
    const userRepository = getRepository(User)

    const users = await userRepository.find({ relations: ['roles'] })

    return res.json(users)
  }

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
}

export const UserController = new UserControllerClass()
