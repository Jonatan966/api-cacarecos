import * as yup from 'yup'

export const CategorySchema = yup.object()
  .shape({
    name: yup.string().required(),
    color: yup.string().required()
  })

export interface CategorySchemaProps {
  name: string;
  color: string;
}
