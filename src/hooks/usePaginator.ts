import { AppPaginatorProps, AppQueryParamsProps } from '@interfaces/Paginator'

export function usePaginator (queryParams: AppQueryParamsProps, maxResults = 25): AppPaginatorProps {
  let { _page = 1, _max = maxResults } = queryParams

  _page = _page < 1 ? 1 : _page
  _max = _max < 1 || _max > maxResults ? maxResults : _max

  return {
    skip: (_page - 1) * _max,
    take: _max
  }
}
