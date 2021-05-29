import { NextFunction, Request } from 'express'
import { validate } from 'uuid'

import { useErrorMessage } from '@hooks/useErrorMessage'
import { NewResponse } from '@interfaces/Controller'

export function validateUUIDParams (paramNames = ['id']) {
  return (req: Request, res: NewResponse, next: NextFunction) => {
    const onlyAvaliableReqParams = Object.fromEntries(
      Object.entries(req.params)
        .filter(reqParam =>
          paramNames.includes(reqParam[0])
        )
    )

    for (const paramName of paramNames) {
      if (!validate(onlyAvaliableReqParams[paramName])) {
        return useErrorMessage(`${paramName} is not valid`, 400, res)
      }
    }

    next()
  }
}
