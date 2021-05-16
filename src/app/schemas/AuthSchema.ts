import { object, string } from 'yup'

export const AuthSchema = object().shape({
  email: string().required(),
  password: string().required()
})

export interface AuthSchemaProps {
  email: string;
  password: string;
}
