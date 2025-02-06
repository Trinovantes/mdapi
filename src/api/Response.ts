import type { MdAuthorAttributes, MdAuthorId } from './schema/Author.js'
import type { MdChapterAttributes, MdChapterId } from './schema/Chapter.js'
import type { MdCoverAttributes, MdCoverId } from './schema/Cover.js'
import type { MdCustomListAttributes, MdCustomListId } from './schema/CustomList.js'
import type { MdMangaAttributes, MdMangaId, MdMangaRelationshipType } from './schema/Manga.js'
import type { MdScanlationGroupAttributes, MdScanlationGroupId } from './schema/ScanlationGroup.js'
import type { MdTagAttributes, MdTagId } from './schema/Tag.js'

type AttributeMap = {
    ['cover_art']: MdCoverAttributes
    ['scanlation_group']: MdScanlationGroupAttributes
    ['manga']: MdMangaAttributes
    ['chapter']: MdChapterAttributes
    ['custom_list']: MdCustomListAttributes
    ['tag']: MdTagAttributes
    ['author']: MdAuthorAttributes
    ['artist']: MdAuthorAttributes
}

type IdMap = {
    ['cover_art']: MdCoverId
    ['scanlation_group']: MdScanlationGroupId
    ['manga']: MdMangaId
    ['chapter']: MdChapterId
    ['custom_list']: MdCustomListId
    ['tag']: MdTagId
    ['author']: MdAuthorId
    ['artist']: MdAuthorId
}

export type MdAttributeType = keyof AttributeMap

export type MdRelationship<T extends MdAttributeType> = {
    id: IdMap[T]
    type: T
    attributes?: AttributeMap[T]
    related?: MdMangaRelationshipType
}

export type MdEntityResponse<T extends MdAttributeType> = {
    result: 'ok'
    response: 'entity'
    data: {
        id: IdMap[T]
        type: T
        attributes: AttributeMap[T]
        relationships?: Array<MdRelationship<MdAttributeType>>
    }
}

export type MdCollectionResponse<T extends MdAttributeType> = {
    result: 'ok'
    response: 'collection'
    data: Array<MdEntityResponse<T>['data']>
    limit: number
    offset: number
    total: number
}

export type MdErrorResponse = {
    result: 'error'
    errors: Array<{
        detail: string
        id: string
        status: number
        title: string
    }>
}

// ----------------------------------------------------------------------------
// MARK: Helpers
// ----------------------------------------------------------------------------

export function findRelationship<D extends MdAttributeType, K extends MdAttributeType>(response: MdEntityResponse<D>['data'] | undefined, relationshipType: K): MdRelationship<K> | undefined {
    for (const relationship of response?.relationships ?? []) {
        if (relationship.type === relationshipType) {
            return relationship as MdRelationship<K>
        }
    }

    return undefined
}

export function findAllRelationships<D extends MdAttributeType, K extends MdAttributeType>(response: MdEntityResponse<D>['data'] | undefined, relationshipType: K): Array<MdRelationship<K>> {
    const relationships: Array<MdRelationship<K>> = []

    for (const relationship of response?.relationships ?? []) {
        if (relationship.type !== relationshipType) {
            continue
        }

        relationships.push(relationship as MdRelationship<K>)
    }

    return relationships
}

export function mapResponseToRelationships<D extends MdAttributeType, K extends MdAttributeType>(responses: Array<MdEntityResponse<D>['data']>, relationshipType: K, throwOnMissing = true): Array<MdRelationship<K>> {
    const relationships = []

    for (const response of responses) {
        const relationship = findRelationship(response, relationshipType)
        if (!relationship) {
            if (throwOnMissing) {
                throw new Error(`Failed to find relationship:${relationshipType} for ${JSON.stringify(response)}`)
            } else {
                continue
            }
        }

        relationships.push(relationship)
    }

    return relationships
}
