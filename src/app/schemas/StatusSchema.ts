import { object, string } from 'yup'

import { AppObjectSchemaProps } from '@interfaces/Schema'
import { OrderStatus, OrderStatusKeys } from '@models/Order'

const StatusYupSchema = object()
  .shape({
    status: string().oneOf(Object.keys(OrderStatus))
  })

class StatusSchemaTypes {
  status: OrderStatusKeys;
}

export const StatusObjectSchema: AppObjectSchemaProps<typeof StatusSchemaTypes.prototype> = {
  Types: StatusSchemaTypes.prototype,
  YupSchema: StatusYupSchema
}
