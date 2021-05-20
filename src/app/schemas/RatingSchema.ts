import { number, object, string } from 'yup'

export const RatingSchema = object().shape({
  stars: number().min(1).max(5).required(),
  content: string().required()
})

export interface RatingSchemaProps {
  stars: number;
  content: string;
}
