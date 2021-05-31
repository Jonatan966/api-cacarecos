import { FindOperator, Like, Repository } from 'typeorm'
import { validate as validateUUID } from 'uuid'

export function useSearchParams<S> (
  queryParams: Partial<S>,
  targetRepository: Repository<S>,
  exactFields: (keyof S)[] = [],
  excludeFields: (keyof S)[] = []
): Partial<S> {
  const repoFields = Object.keys(targetRepository.metadata.propertiesMap)

  const onlyAcceptableFields = repoFields.filter(repoField =>
    !excludeFields.includes(repoField as any)
  )

  const filteredQueryParams = Object.entries(queryParams)
    .filter(queryParam => onlyAcceptableFields.includes(queryParam[0]))

  const mappedQueryParams = filteredQueryParams.map(queryParam =>
    [queryParam[0], exactFields.includes(queryParam[0] as any) ? queryParam[1] : Like(`%${queryParam[1]}%`)]
  )

  return Object.fromEntries(validateQueryParams(mappedQueryParams, targetRepository))
}

function validateQueryParams<S> (queryParams: any[][], targetRepository: Repository<S>): any[][] {
  const mappedColumns = targetRepository.metadata.columns.map(column =>
    ({ type: column.type, name: column.propertyName })
  )

  const validatedQueryParams = []

  for (const [columnName, columnValue] of queryParams) {
    const columnType = mappedColumns.find(column => column.name === columnName).type
    let validatedColumn = columnValue

    if (!(columnValue instanceof FindOperator)) {
      switch (columnType) {
        case 'uuid':
          validatedColumn = validateUUID(columnValue) ? columnValue : null
          break
        case Number:
          validatedColumn = isNaN(Number(columnValue)) ? 0 : Number(columnValue)
          break
        case Date:
          validatedColumn = new Date(isNaN(Date.parse(columnValue)) ? columnValue : Date.now())
          break
        case Boolean:
          validatedColumn = columnValue === 'true'
          break
      }
    }

    const validatedQueryParam = [
      columnName,
      validatedColumn
    ]

    validatedQueryParams.push(validatedQueryParam)
  }

  return validatedQueryParams
}
