import type { Brand } from '../../Brand.js'
import type { MdEntityResponse } from '../Response.js'
import { fetchMangaDexByIds } from '../../utils/fetchMangaDex.js'

export type MdScanlationGroupAttributes = {
    name: string
    website: string | null
    ircServer: string | null
    ircChanel: string | null
    discord: string | null
    contactEmail: string | null
    description: string | null
    locked: boolean
    official: boolean

    version: number
    createdAt: string
    updatedAt: string
}

export type MdScanlationGroupId = Brand<string, 'MdScanlationGroupId'>
export type MdScanlationGroup = MdEntityResponse<'scanlation_group'>['data']

// ----------------------------------------------------------------------------
// MARK: API
// ----------------------------------------------------------------------------

function getScanlationGroupCollectionEndpoint(apiUrl: string) {
    return `${apiUrl}/group`
}

function getScanlationGroupEndpoint(apiUrl: string, groupId: string) {
    return `${apiUrl}/group/${groupId}`
}

export async function fetchScanlationGroups(apiUrl: string, groupIds: Array<MdScanlationGroupId>): Promise<Array<MdScanlationGroup>> {
    return await fetchMangaDexByIds<'scanlation_group'>(apiUrl, getScanlationGroupCollectionEndpoint, getScanlationGroupEndpoint, groupIds)
}
