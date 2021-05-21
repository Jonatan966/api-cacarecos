import { object, string } from 'yup'

import { AppObjectSchemaProps } from '@interfaces/Schema'

const AuthYupSchema = object().shape({
  email: string().required(),
  password: string().required()
})

class AuthSchemaTypes {
  email: string;
  password: string;
}

export const AuthObjectSchema: AppObjectSchemaProps<typeof AuthSchemaTypes.prototype> = {
  Types: AuthSchemaTypes.prototype,
  YupSchema: AuthYupSchema
}
