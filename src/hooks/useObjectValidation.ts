import * as yup from 'yup'

type IsError = {
  $isError?: boolean;
}

export async function useObjectValidation <T = any> (data: any, schema: yup.ObjectSchema<any>): Promise<T & IsError> {
  try {
    return await schema.validate(data, { abortEarly: false })
  } catch (error) {
    const errorMessages = {} as any

    error.inner.forEach(error => {
      errorMessages[error.path] = error.message
    })

    return {
      ...errorMessages,
      $isError: true
    }
  }
}
