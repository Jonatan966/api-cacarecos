import { array, number, object, string } from 'yup'

import { AppObjectSchemaProps } from '@interfaces/Schema'

const OrderYupSchema = object().shape({
  products: array(object().shape({
    id: string().required(),
    units: number().min(1).required()
  })).required()
})

class OrderSchemaTypes {
  products: Array<{
    id: string,
    units: number
  }>
}

export const OrderObjectSchema: AppObjectSchemaProps<typeof OrderSchemaTypes.prototype> = {
  Types: OrderSchemaTypes.prototype,
  YupSchema: OrderYupSchema
}
