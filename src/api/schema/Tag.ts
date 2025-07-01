import type { MdLocalizedString } from './Language.js'
import type { MdCollectionResponse, MdEntityResponse } from '../Response.js'
import type { Brand } from '../../Brand.js'
import { fetchMangaDex } from '../../utils/fetchMangaDex.js'

export type MdTagAttributes = {
    name: MdLocalizedString
    description: MdLocalizedString
    group: string
    version: number
}

export type MdTagId = Brand<string, 'MdTagId'>
export type MdTag = MdEntityResponse<'tag'>['data']

// ----------------------------------------------------------------------------
// MARK: API
// ----------------------------------------------------------------------------

function getTagCollectionEndpoint(apiUrl: string) {
    return `${apiUrl}/manga/tag`
}

export async function fetchTags(apiUrl: string): Promise<MdCollectionResponse<'tag'>> {
    return await fetchMangaDex<MdCollectionResponse<'tag'>>(getTagCollectionEndpoint(apiUrl))
}
