import type { MdAttributeType, MdEntityResponse, MdCollectionResponse } from '../Response.js'
import type { MdSortOrder } from './SortOrder.js'
import { fetchMangaDexByIds } from '../../utils/fetchMangaDex.js'
import { createSearchParamUrl } from '../../utils/createSearchParamUrl.js'
import { fetchMangaDex } from '../../utils/fetchMangaDex.js'
import type { Brand } from '../../Brand.js'

export type MdAuthorAttributes = {
    name: string
    imageUrl: string | null
    biography: Array<never>

    version: number
    createdAt: string
    updatedAt: string
}

export type MdAuthorId = Brand<string, 'MdAuthorId'>
export type MdAuthor = MdEntityResponse<'author'>['data']
export type MdArtist = MdEntityResponse<'artist'>['data']

export type MdAuthorQuery = Partial<{
    'limit': number
    'offset': number
    'ids': Array<MdAuthorId>
    'includes': Array<MdAttributeType>

    'name': string
    'order[name]': MdSortOrder
}>

// ----------------------------------------------------------------------------
// MARK: API
// ----------------------------------------------------------------------------

function getAuthorCollectionEndpoint(apiUrl: string) {
    return `${apiUrl}/author`
}

function getAuthorEndpoint(apiUrl: string, authorId: string) {
    return `${apiUrl}/author/${authorId}`
}

export const MD_FETCH_AUTHORS_BASE_QUERY: MdAuthorQuery = {
    includes: [
        'manga',
    ],
}

export async function fetchAuthorsByIds(apiUrl: string, authorIds: Array<MdAuthorId>, queryOverrides?: MdAuthorQuery): Promise<Array<MdAuthor>> {
    const query: MdAuthorQuery = {
        ...MD_FETCH_AUTHORS_BASE_QUERY,
        ...queryOverrides,
    }

    return await fetchMangaDexByIds<'author'>(apiUrl, getAuthorCollectionEndpoint, getAuthorEndpoint, authorIds, query)
}

export async function fetchAuthorByName(apiUrl: string, name: string, queryOverrides?: MdAuthorQuery): Promise<Array<MdAuthor>> {
    const query: MdAuthorQuery = {
        limit: 10,
        name: name.toLocaleLowerCase(), // Case insensitive
        ...MD_FETCH_AUTHORS_BASE_QUERY,
        ...queryOverrides,
    }

    const url = createSearchParamUrl(getAuthorCollectionEndpoint(apiUrl), query, 'bracket')
    const res = await fetchMangaDex<MdCollectionResponse<'author'>>(url)
    return res.data
}
