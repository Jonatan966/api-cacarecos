import { ObjectSchema } from 'yup'

export function makeSchemaFieldsOptional (schema: ObjectSchema<any>, ...fieldNames: string[]) {
  const schemaFieldKeys = Object.keys(schema.fields)

  schemaFieldKeys.forEach(schemaFieldKey => {
    if (fieldNames.length) {
      const findedField = fieldNames.find(fieldName => schemaFieldKey === fieldName)

      if (findedField) {
        schema.fields[findedField] = schema.fields[findedField].optional()
      }
      return
    }

    schema.fields[schemaFieldKey] = schema.fields[schemaFieldKey].optional()
  })

  return schema
}
