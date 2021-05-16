import * as yup from 'yup'

export const UserSchema = yup.object()
  .shape({
    name: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required()
  })

export interface UserProps {
  name: string;
  email: string;
  password: string;
}
