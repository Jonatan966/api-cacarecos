import { Controller } from 'src/@types/Controller'
import { getRepository } from 'typeorm'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useHashString } from '@hooks/useHashString'
import { useInsertOnlyNotExists } from '@hooks/useInsertOnlyNotExists'
import { useObjectValidation } from '@hooks/useObjectValidation'
import { User } from '@models/User'

import { UserProps, UserSchema } from '../schemas/UserSchema'

export const UserController: Controller = {
  async create (req, res) {
    const {
      $isError,
      ...body
    } = await useObjectValidation<UserProps>(req.body, UserSchema)

    if ($isError) {
      return useErrorMessage('invalid fields', 400, res, {
        fields: body
      })
    }

    const userHashedPassword = await useHashString(body.password)

    const insertedUser = await useInsertOnlyNotExists({
      ...body,
      password: userHashedPassword
    }, User, { email: body.email })

    if (!insertedUser) {
      return useErrorMessage('there is already a user with that email', 400, res)
    }

    delete insertedUser.password

    return res.status(201)
      .json(insertedUser)
  },

  async remove (req, res) {
    const { id } = req.params

    const userRepository = getRepository(User)

    const deleteResult = await userRepository.delete(id)

    if (deleteResult.affected) {
      return res
        .sendStatus(200)
    }

    return useErrorMessage('user does not exists', 400, res)
  },

  async index (_req, res) {
    const userRepository = getRepository(User)

    const users = await userRepository.find({ relations: ['roles'] })

    return res.json(users)
  },

  async show (req, res) {
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
