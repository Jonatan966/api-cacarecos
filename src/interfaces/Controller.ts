import { Request, Response } from 'express'

import { Product } from '@models/Product'
import { User } from '@models/User'

export interface NewResponse extends Response {
  locals: {
    user: Pick<User, 'id' | 'roles'>
    product: Product
  }
}

export interface AppControllerProps {
  create: (req: Request, res: NewResponse) => Promise<NewResponse>;
  remove: (req: Request, res: NewResponse) => Promise<NewResponse>;
  index: (req: Request, res: NewResponse) => Promise<NewResponse>;
  show?: (req: Request, res: NewResponse) => Promise<NewResponse>;
  update?: (req: Request, res: NewResponse) => Promise<NewResponse>;
}
