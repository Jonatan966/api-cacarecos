import { AppObjectSchemaProps } from '@interfaces/Schema'

type IsError = {
  $isError?: boolean;
}

type HookReturn<SCH> = Promise<SCH & IsError>

export async function useObjectValidation<OBJ> (data: any, appSchema: AppObjectSchemaProps<OBJ>): HookReturn<typeof appSchema.Types> {
  try {
    return await appSchema.YupSchema.validate(data, { abortEarly: false, stripUnknown: true })
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
