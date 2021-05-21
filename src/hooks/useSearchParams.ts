import { Like, Repository } from 'typeorm'

export function useSearchParams<S> (
  queryParams: Partial<S>,
  targetRepository: Repository<S>,
  exactFields: string[] = [],
  excludeFields: string[] = []
): Partial<S> {
  const repoFields = Object.keys(targetRepository.metadata.propertiesMap)

  const onlyAcceptableFields = repoFields.filter(repoField =>
    !excludeFields.includes(repoField)
  )

  const filteredQueryParams = Object.entries(queryParams)
    .filter(queryParam => onlyAcceptableFields.includes(queryParam[0]))

  const mappedQueryParams = filteredQueryParams.map(queryParam =>
    [queryParam[0], exactFields.includes(queryParam[0]) ? queryParam[1] : Like(`%${queryParam[1]}%`)]
  )

  return Object.fromEntries(mappedQueryParams)
}
