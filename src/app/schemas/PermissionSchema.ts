import { object, string } from 'yup'

import { AppObjectSchemaProps } from '@interfaces/Schema'

const PermissionYupSchema = object().shape({
  name: string().required()
})

class PermissionSchemaTypes {
  name: string;
}

export const PermissionObjectSchema: AppObjectSchemaProps<typeof PermissionSchemaTypes.prototype> = {
  Types: PermissionSchemaTypes.prototype,
  YupSchema: PermissionYupSchema
}
