import * as yup from 'yup'

export const ProductSchema = yup.object()
  .shape({
    name: yup.string().required(),
    slug: yup.string().required(),
    description: yup.string().required(),
    other_details: yup.string(),
    price: yup.number().required(),
    units: yup.number().required(),
    category: yup.string().required(),
    main_image: yup.object({
      type: yup.string().matches(/new|storaged/),
      identifier: yup.string()
    }).nullable()
  })

export interface ProductSchemaProps {
  name: string;
  slug: string;
  description: string;
  other_details?: string;
  price: number;
  units: number;
  category: string;

  main_image?: {
    type: 'new' | 'storaged';
    identifier: string;
  }
}
