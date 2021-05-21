import { number, object, string } from 'yup'

import { AppObjectSchemaProps } from '@interfaces/Schema'

const RatingYupSchema = object().shape({
  stars: number().min(1).max(5).required(),
  content: string().required()
})

class RatingSchemaTypes {
  stars: number;
  content: string;
}

export const RatingObjectSchema: AppObjectSchemaProps<typeof RatingSchemaTypes.prototype> = {
  Types: RatingSchemaTypes.prototype,
  YupSchema: RatingYupSchema
}
