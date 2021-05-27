import { number, object } from 'yup'

import { AppObjectSchemaProps } from '@interfaces/Schema'

const StockYupSchema = object().shape({
  // .test('is_uuid', 'this value is not a valid id', value => validateUUID(value)),
  units: number().required().notOneOf([0])
})

class StockSchemaTypes {
  units: number;
}

export const StockObjectSchema: AppObjectSchemaProps<typeof StockSchemaTypes.prototype> = {
  Types: StockSchemaTypes.prototype,
  YupSchema: StockYupSchema
}
