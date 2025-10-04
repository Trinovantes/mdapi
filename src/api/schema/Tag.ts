import type { MdLocalizedString } from './Language.ts'
import type { MdCollectionResponse, MdEntityResponse } from '../Response.ts'
import type { Brand } from '../../Brand.ts'
import { fetchMangaDex } from '../../utils/fetchMangaDex.ts'

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
