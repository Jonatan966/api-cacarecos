import { object, string } from 'yup'

import { AppObjectSchemaProps } from '@interfaces/Schema'

const CategoryYupSchema = object()
  .shape({
    name: string().required(),
    color: string().required()
  })

class CategorySchemaTypes {
  name: string;
  color: string;
}

export const CategoryObjectSchema: AppObjectSchemaProps<typeof CategorySchemaTypes.prototype> = {
  Types: CategorySchemaTypes.prototype,
  YupSchema: CategoryYupSchema
}
