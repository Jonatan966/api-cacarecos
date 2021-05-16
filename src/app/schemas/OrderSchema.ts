import { array, number, object, string } from 'yup'

export const OrderSchema = object().shape({
  products: array(object().shape({
    id: string().required(),
    units: number().min(1).required()
  })).required()
})

export interface OrderSchemaProps {
  products: Array<{
    id: string,
    units: number
  }>
}
