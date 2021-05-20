import * as yup from 'yup'

export const RoleSchema = yup.object()
  .shape({
    name: yup.string().required(),
    permissions: yup.array().of(yup.string()).required()
  })

export interface RoleSchemaProps {
  name: string;
  permissions: string[];
}
