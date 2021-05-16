import { compare } from 'bcrypt'
import { NextFunction, Request } from 'express'
import jwt from 'jsonwebtoken'
import { NewResponse } from 'src/@types/Controller'
import { getRepository } from 'typeorm'
import { v4 as generateUUID } from 'uuid'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { useObjectValidation } from '@hooks/useObjectValidation'
import { User } from '@models/User'

import { AuthSchemaProps, AuthSchema } from '../schemas/AuthSchema'

export const AuthController = {
  async logIn (req: Request, res: NewResponse) {
    const user = await AuthController._searchUserByLogin(req.body, res)

    if (!user) {
      return
    }

    delete user.password

    const loginToken = jwt.sign({ sub: user.loginId }, process.env.JWT_SECRET)

    res.status(200)
      .send({
        token: loginToken
      })
  },

  async logOut (req: Request, res: NewResponse) {
    const regenerateSuccess = await AuthController._regenerateUserLoginId(res.locals.user.id)

    if (!regenerateSuccess) {
      return useErrorMessage('internal error when trying to log out', 500, res)
    }

    return res.status(200).send()
  },

  async validate (req: Request, res: NewResponse, next: NextFunction) {
    const { token } = req.cookies

    const decodedToken = await AuthController._checkAndOpenToken(token, res)

    if (!decodedToken) {
      return
    }

    const user = await AuthController._searchUserById(decodedToken.sub, res)

    if (!user) {
      return
    }

    res.locals.user = user

    next()
    return true
  },

  async _searchUserByLogin (body: any, res: NewResponse) {
    const { email, password, $isError } = await useObjectValidation<AuthSchemaProps>(body, AuthSchema)

    if ($isError) {
      useErrorMessage('invalid fields', 400, res, {
        fields: { email, password }
      })

      return
    }

    const userRepository = getRepository(User)

    const user = await userRepository.findOne({ email }, {
      select: ['loginId', 'password']
    })

    if (!user) {
      useErrorMessage('incorrect username and/or password', 400, res)

      return
    }

    const isCorrectPassword = await compare(password, user.password)

    if (!isCorrectPassword) {
      useErrorMessage('incorrect username and/or password', 400, res)

      return
    }

    return user
  },

  async _searchUserById (loginId: string, res: NewResponse) {
    const userRepository = getRepository(User)

    const user = await userRepository.findOne({ loginId }, {
      select: ['id'],
      relations: ['roles']
    })

    if (!user) {
      useErrorMessage('token is invalid', 400, res)
      return
    }

    return user
  },

  async _checkAndOpenToken (token: string, res: NewResponse) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

      return decodedToken as { sub: string }
    } catch {
      useErrorMessage('token is invalid', 400, res)
    }
  },

  async _regenerateUserLoginId (userId: string) {
    const userRepository = getRepository(User)

    const result = await userRepository.update(userId, {
      loginId: generateUUID()
    })

    return !!result.affected
  }
}
