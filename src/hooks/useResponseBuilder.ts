import { Repository } from 'typeorm'

import { AppPaginatorProps } from '@interfaces/Paginator'

export async function useResponseBuilder<S> (
  searchResult: S[],
  paginator: AppPaginatorProps,
  searchParams: Partial<S>,
  repository: Repository<S>,
  extraFields?: any
) {
  const page = (paginator.skip / paginator.take) + 1

  const dataCount = await repository.count({
    where: searchParams
  })

  return {
    ...extraFields,
    page,
    previous_page: (page > 1) && `/_page=${page - 1}&_max=${paginator.take}`,
    next_page: ((paginator.skip + paginator.take) < dataCount) && `/_page=${page + 1}&_max=${paginator.take}`,
    results: searchResult
  }
}
