import { array, object, string } from 'yup'

import { AppObjectSchemaProps } from '@interfaces/Schema'

const RoleYupSchema = object()
  .shape({
    name: string().required(),
    permissions: array().of(string()).required()
  })

class RoleSchemaTypes {
  name: string;
  permissions: string[];
}

export const RoleObjectSchema: AppObjectSchemaProps<typeof RoleSchemaTypes.prototype> = {
  Types: RoleSchemaTypes.prototype,
  YupSchema: RoleYupSchema
}
