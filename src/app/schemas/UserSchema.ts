import { object, string } from 'yup'

import { AppObjectSchemaProps } from '@interfaces/Schema'

const UserYupSchema = object()
  .shape({
    name: string().required(),
    email: string().required(),
    password: string().required()
  })

class UserSchemaTypes {
  name: string;
  email: string;
  password: string;
}

export const UserObjectSchema: AppObjectSchemaProps<typeof UserSchemaTypes.prototype> = {
  Types: UserSchemaTypes.prototype,
  YupSchema: UserYupSchema
}
