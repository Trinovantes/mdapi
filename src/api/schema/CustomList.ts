import { Brand } from '@/Brand.js'
import { MdEntityResponse } from '../Response.js'
import { fetchMangaDexByIds } from '@/utils/fetchMangaDex.js'

export type MdCustomListAttributes = {
    name: string
    visibility: 'private' | 'public'
    version: number
}

export type MdCustomListId = Brand<string, 'MdCustomListId'>
export type MdCustomList = MdEntityResponse<'custom_list'>['data']

// ----------------------------------------------------------------------------
// MARK: API
// ----------------------------------------------------------------------------

function getListCollectionEndpoint(apiUrl: string) {
    return `${apiUrl}/list`
}

function getListEndpoint(apiUrl: string, listId: string) {
    return `${apiUrl}/list/${listId}`
}

export async function fetchListsByIds(apiUrl: string, listIds: Array<MdCustomListId>): Promise<Array<MdCustomList>> {
    return await fetchMangaDexByIds<'custom_list'>(apiUrl, getListCollectionEndpoint, getListEndpoint, listIds)
}
