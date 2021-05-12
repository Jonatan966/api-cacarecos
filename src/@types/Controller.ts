import { Request, Response } from 'express'

import { ErrorObject } from '@hooks/useErrorMessage'
import { User } from '@models/User'

export interface NewResponse<T = any> extends Response<T> {
  locals: {
    user: Pick<User, 'id' | 'roles'>
  }
}

export interface DefaultController<T = any> {
  create: (req: Request, res: NewResponse<T>) => Promise<NewResponse<T | ErrorObject>>;
  remove: (req: Request, res: Response<T>) => Promise<Response<T | ErrorObject>>;
  index: (req: Request, res: Response<T[]>) => Promise<Response<T[] | ErrorObject>>;
  show: (req: Request, res: Response<T>) => Promise<Response<T | ErrorObject>>;
  update?: (req: Request, res: Response<T>) => Promise<Response<T | ErrorObject>>;
}

export interface TemplateController {
  [name: string]: (req: Request, res: NewResponse) => Promise<any>;
}
