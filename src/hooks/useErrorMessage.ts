import { Response } from 'express'

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
