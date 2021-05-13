import { Request, Response } from 'express'

import { ErrorObject } from '@hooks/useErrorMessage'
import { Product } from '@models/Product'
import { User } from '@models/User'

export interface NewResponse<T = any> extends Response<T> {
  locals: {
    user: Pick<User, 'id' | 'roles'>
    product: Product
  }
}

export interface DefaultController<T = any> {
  create: (req: Request, res: NewResponse<T>) => Promise<NewResponse<T | ErrorObject>>;
  remove: (req: Request, res: NewResponse<T>) => Promise<NewResponse<T | ErrorObject>>;
  index: (req: Request, res: NewResponse<T[]>) => Promise<NewResponse<T[] | ErrorObject>>;
  show?: (req: Request, res: NewResponse<T>) => Promise<NewResponse<T | ErrorObject>>;
  update?: (req: Request, res: NewResponse<T>) => Promise<NewResponse<T | ErrorObject>>;
}

export interface TemplateController {
  [name: string]: (req: Request, res: NewResponse) => Promise<any>;
}
