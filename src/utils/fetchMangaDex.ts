import { MAX_IDS_PER_QUERY } from '../api/Constants.js'
import type { MdAttributeType, MdEntityResponse, MdCollectionResponse } from '../api/Response.js'
import { createSearchParamUrl, type SearchParam } from './createSearchParamUrl.js'

export async function fetchMangaDex<T>(url: string, config: RequestInit = { method: 'GET' }, responseIsJson = true): Promise<T> {
    const res = await fetch(url, config)

    if (res.headers.get('content-length') === '0') {
        throw new Error('Empty MangaDex response')
    }
    if (!(res.status >= 200 && res.status < 300)) {
        throw new Error(`${res.status}: ${res.statusText}`)
    }

    if (responseIsJson) {
        return await res.json() as T
    } else {
        return await res.text() as T
    }
}

type GetCollectionRoute = (apiUrl: string) => string
type GetEntityRoute = (apiUrl: string, id: string) => string

export async function fetchMangaDexByIds<T extends MdAttributeType>(apiUrl: string, getCollectionRoute: GetCollectionRoute, getEntityRoute: GetEntityRoute, ids: Array<string>, query?: SearchParam): Promise<Array<MdEntityResponse<T>['data']>> {
    if (ids.length < 1) {
        return []
    }

    // Use different endpoint in singular case for better caching
    if (ids.length === 1) {
        const url = createSearchParamUrl(getEntityRoute(apiUrl, ids[0]), query, 'bracket')
        const res = await fetchMangaDex<MdEntityResponse<T>>(url)
        return [res.data]
    } else if (ids.length <= MAX_IDS_PER_QUERY) {
        const url = createSearchParamUrl(getCollectionRoute(apiUrl), { ids, limit: ids.length, ...query }, 'bracket')
        const res = await fetchMangaDex<MdCollectionResponse<T>>(url)
        return res.data
    } else {
        return [
            ...await fetchMangaDexByIds<T>(apiUrl, getCollectionRoute, getEntityRoute, ids.slice(0, MAX_IDS_PER_QUERY), query),
            ...await fetchMangaDexByIds<T>(apiUrl, getCollectionRoute, getEntityRoute, ids.slice(MAX_IDS_PER_QUERY), query),
        ]
    }
}
