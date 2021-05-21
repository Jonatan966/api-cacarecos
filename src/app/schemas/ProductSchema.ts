import * as yup from 'yup'

import { AppObjectSchemaProps } from '@interfaces/Schema'

const ProductYupSchema = yup.object()
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

class ProductSchemaTypes {
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

export const ProductObjectSchema: AppObjectSchemaProps<typeof ProductSchemaTypes.prototype> = {
  Types: ProductSchemaTypes.prototype,
  YupSchema: ProductYupSchema
}
