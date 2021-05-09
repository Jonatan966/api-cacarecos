import { Request, Response } from 'express'

import { ErrorObject } from '@hooks/useErrorMessage'

export interface Controller<T = any> {
  create: (req: Request, res: Response<T>) => Promise<Response<T | ErrorObject>>;
  remove: (req: Request, res: Response<T>) => Promise<Response<T | ErrorObject>>;
  index: (req: Request, res: Response<T[]>) => Promise<Response<T[] | ErrorObject>>;
  show: (req: Request, res: Response<T>) => Promise<Response<T | ErrorObject>>;
  update?: (req: Request, res: Response<T>) => Promise<Response<T | ErrorObject>>;
}
