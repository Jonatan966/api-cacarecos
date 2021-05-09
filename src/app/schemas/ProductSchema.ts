import * as yup from 'yup'

export const ProductSchema = yup.object()
  .shape({
    name: yup.string().required(),
    slug: yup.string().required(),
    description: yup.string().required(),
    other_details: yup.string(),
    price: yup.number().required(),
    units: yup.number().required(),
    category: yup.string().required()
  })

export interface ProductProps {
  name: string;
  slug: string;
  description: string;
  other_details?: string;
  price: number;
  units: number;
  category: string;
}
