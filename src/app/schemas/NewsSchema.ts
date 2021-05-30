import { boolean, object, string } from 'yup'

import { AppObjectSchemaProps } from '@interfaces/Schema'

const NewsYupSchema = object()
  .shape({
    title: string().required(),
    body: string().required(),
    action_text: string().required(),
    action_url: string().required(),
    product_image: string().required(),
    is_main: boolean().nullable().default(false)
  })

class NewsSchemaTypes {
  title: string;
  body: string;
  action_text: string;
  action_url: string;
  product_image: string;
  is_main: boolean;
}

export const NewsObjectSchema: AppObjectSchemaProps<typeof NewsSchemaTypes.prototype> = {
  Types: NewsSchemaTypes.prototype,
  YupSchema: NewsYupSchema
}
