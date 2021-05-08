import { Response } from 'express'

export interface ErrorObject {
  error: {
    message: string;
    statusCode: number;
    [key: string]: any;
  }
}

export function useErrorMessage (message: string, statusCode: number, response: Response, extra?: any) {
  return response
    .status(statusCode)
    .json({
      error: {
        message,
        statusCode,
        ...extra
      }
    })
}
