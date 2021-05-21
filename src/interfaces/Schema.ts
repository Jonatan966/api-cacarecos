import { ObjectSchema } from 'yup'

export interface AppObjectSchemaProps<OBJ> {
  Types: OBJ;
  YupSchema: ObjectSchema<any>;
}
