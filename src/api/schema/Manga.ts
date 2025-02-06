import { MdLanguage, MdLocalizedString } from './Language.js'
import { MdTag, MdTagId } from './Tag.js'
import { MdExternalSite } from './ExternalSite.js'
import { MdAttributeType, MdCollectionResponse, MdEntityResponse } from '../Response.js'
import { MdSortOrder } from './SortOrder.js'
import { Brand } from '@/Brand.js'
import { MdTagSearchMode } from './TagSearchMode.js'
import { MdAuthorId } from './Author.js'
import { fetchMangaDexByIds } from '@/utils/fetchMangaDex.js'
import { createSearchParamUrl } from '@/utils/createSearchParamUrl.js'
import { fetchMangaDex } from '@/utils/fetchMangaDex.js'
import { MdChapter, MdChapterId, MdChapterQuery, MD_FETCH_CHAPTERS_BASE_QUERY } from './Chapter.js'
import { MAX_FEED_PER_QUERY } from '@/api/Constants.js'
import { MdAccessToken } from './Auth.js'

// ----------------------------------------------------------------------------
// MARK: Manga Attributes
// ----------------------------------------------------------------------------

export const MD_PUBLICATION_DEMOGRAPHIC_OPTIONS = [
    { label: 'Shounen', value: 'shounen' },
    { label: 'Shoujo', value: 'shoujo' },
    { label: 'Josei', value: 'josei' },
    { label: 'Seinen', value: 'seinen' },
] as const

export const MD_MANGA_STATUS_OPTIONS = [
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Completed', value: 'completed' },
    { label: 'Hiatus', value: 'hiatus' },
    { label: 'Cancelled', value: 'cancelled' },
] as const

export const MD_CONTENT_RATING_OPTIONS =  [
    { label: 'Safe', value: 'safe' },
    { label: 'Suggestive', value: 'suggestive' },
    { label: 'Erotica', value: 'erotica' },
    { label: 'Pornographic', value: 'pornographic' },
] as const

export const MD_READING_STATUS_OPTIONS = [
    { label: 'Reading', value: 'reading' },
    { label: 'On Hold', value: 'on_hold' },
    { label: 'Plan to Read', value: 'plan_to_read' },
    { label: 'Dropped', value: 'dropped' },
    { label: 'Rereading', value: 're_reading' },
    { label: 'Completed', value: 'completed' },
] as const

export const MD_MANGA_RELATIONSHIP_TYPE_OPTIONS = [
    { label: 'Monochrome', value: 'monochrome' },
    { label: 'Colored', value: 'colored' },

    { label: 'Preserialization', value: 'preserialization' },
    { label: 'Serialization', value: 'serialization' },

    { label: 'Prequel', value: 'prequel' },
    { label: 'Sequel', value: 'sequel' },
    { label: 'Main Story', value: 'main_story' },
    { label: 'Side Story', value: 'side_story' },

    { label: 'Adapted From', value: 'adapted_from' },
    { label: 'Spin-Off', value: 'spin_off' },
    { label: 'Based On', value: 'based_on' },
    { label: 'Doujinshi', value: 'doujinshi' },

    { label: 'Same Franchise', value: 'same_franchise' },
    { label: 'Shared Universe', value: 'shared_universe' },
    { label: 'Alternate Story', value: 'alternate_story' },
    { label: 'Alternate Version', value: 'alternate_version' },
] as const

export type MdPublicationDemographic = (typeof MD_PUBLICATION_DEMOGRAPHIC_OPTIONS[number])['value']
export type MdMangaStatus = (typeof MD_MANGA_STATUS_OPTIONS[number])['value']
export type MdContentRating = (typeof MD_CONTENT_RATING_OPTIONS[number])['value']
export type MdReadingStatus = (typeof MD_READING_STATUS_OPTIONS[number])['value']
export type MdMangaRelationshipType = (typeof MD_MANGA_RELATIONSHIP_TYPE_OPTIONS[number])['value']

// ----------------------------------------------------------------------------
// MARK: Manga
// ----------------------------------------------------------------------------

export type MdMangaAttributes = {
    title: MdLocalizedString
    altTitles: Array<MdLocalizedString>
    description: MdLocalizedString
    originalLanguage: MdLanguage
    lastVolume: string | null
    lastChapter: string | null
    publicationDemographic: MdPublicationDemographic | null
    status: MdMangaStatus | null
    year: number | null
    contentRating: MdContentRating | null
    tags: Array<MdTag>
    links: Partial<Record<MdExternalSite, string>> | null

    version: number
    createdAt: string
    updatedAt: string
}

export type MdMangaId = Brand<string, 'MdMangaId'>
export type MdManga = MdEntityResponse<'manga'>['data']

export type MdMangaQuery = Partial<{
    'limit': number
    'offset': number
    'ids': Array<MdMangaId>
    'includes': Array<MdAttributeType>

    'order[title]': MdSortOrder
    'order[year]': MdSortOrder
    'order[createdAt]': MdSortOrder
    'order[updatedAt]': MdSortOrder
    'order[latestUploadedChapter]': MdSortOrder
    'order[followedCount]': MdSortOrder
    'order[relevance]': MdSortOrder

    'title': string
    'authors': Array<MdAuthorId>
    'artists': Array<MdAuthorId>
    'year': number
    'includedTags': Array<MdTagId>
    'includedTagsMode': MdTagSearchMode
    'excludedTags': Array<MdTagId>
    'excludedTagsMode': MdTagSearchMode
    'status': Array<MdMangaStatus>
    'originalLanguage': Array<MdLanguage>
    'publicationDemographic': Array<MdPublicationDemographic>
    'contentRating': Array<MdContentRating>
    'createdAtSince': string
    'updatedAtSince': string
    'hasAvailableChapters': '0' | '1'
}>

// ----------------------------------------------------------------------------
// MARK: API Manga
// ----------------------------------------------------------------------------

function getMangaCollectionEndpoint(apiUrl: string) {
    return `${apiUrl}/manga`
}

function getMangaEndpoint(apiUrl: string, mangaId: string) {
    return `${apiUrl}/manga/${mangaId}`
}

export const MD_FETCH_MANGA_BASE_QUERY: MdMangaQuery = {
    includes: [
        'cover_art',
        'author',
        'artist',
        'manga',
    ],
}

export async function fetchMangasByIds(apiUrl: string, mangaIds: Array<MdMangaId>, queryOverrides?: MdMangaQuery): Promise<Array<MdManga>> {
    const query: MdMangaQuery = {
        ...MD_FETCH_MANGA_BASE_QUERY,
        ...queryOverrides,
    }

    return await fetchMangaDexByIds<'manga'>(apiUrl, getMangaCollectionEndpoint, getMangaEndpoint, mangaIds, query)
}

export async function fetchMangas(apiUrl: string, queryOverrides?: MdMangaQuery): Promise<MdCollectionResponse<'manga'>> {
    const query: MdMangaQuery = {
        ...MD_FETCH_MANGA_BASE_QUERY,
        ...queryOverrides,
    }

    const url = createSearchParamUrl(getMangaCollectionEndpoint(apiUrl), query, 'bracket')
    return await fetchMangaDex<MdCollectionResponse<'manga'>>(url)
}

// ----------------------------------------------------------------------------
// MARK: API Manga Feed
// ----------------------------------------------------------------------------

function getMangaFeedEndpoint(apiUrl: string, mangaId: string) {
    return `${apiUrl}/manga/${mangaId}/feed`
}

export async function fetchMangaFeed(apiUrl: string, mangaId: MdMangaId, offset = 0): Promise<Array<MdChapter>> {
    const query: MdChapterQuery = {
        ...MD_FETCH_CHAPTERS_BASE_QUERY,
        contentRating: MD_CONTENT_RATING_OPTIONS.map((opt) => opt.value),
        limit: MAX_FEED_PER_QUERY,
        offset,
    }

    const url = createSearchParamUrl(getMangaFeedEndpoint(apiUrl, mangaId), query, 'bracket')
    const res = await fetchMangaDex<MdCollectionResponse<'chapter'>>(url)

    // Check if there are more pages
    if (res.offset + res.limit < res.total) {
        return [
            ...res.data,
            ...await fetchMangaFeed(apiUrl, mangaId, offset + MAX_FEED_PER_QUERY),
        ]
    } else {
        return res.data
    }
}

// ----------------------------------------------------------------------------
// MARK: API Manga Library
// ----------------------------------------------------------------------------

export type MdMangaReadingStatusesResponse = {
    statuses: Record<MdMangaId, MdReadingStatus | null>
}

export type MdMangaReadingStatusResponse = {
    status: MdReadingStatus | null
}

function getMangasReadingStatusEndpoint(apiUrl: string) {
    return `${apiUrl}/manga/status`
}

function getMangaReadingStatusEndpoint(apiUrl: string, mangaId: string) {
    return `${apiUrl}/manga/${mangaId}/status`
}

export async function fetchMangaCollectionReadingStatus(apiUrl: string, accessToken: MdAccessToken): Promise<MdMangaReadingStatusesResponse['statuses']> {
    const url = getMangasReadingStatusEndpoint(apiUrl)
    const res = await fetchMangaDex<MdMangaReadingStatusesResponse>(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    return res.statuses
}

export async function fetchMangaReadingStatus(apiUrl: string, accessToken: MdAccessToken, mangaId: MdMangaId): Promise<MdMangaReadingStatusResponse['status']> {
    const url = getMangaReadingStatusEndpoint(apiUrl, mangaId)
    const res = await fetchMangaDex<MdMangaReadingStatusResponse>(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    return res.status
}

export async function fetchSetMangaReadingStatus(apiUrl: string, accessToken: MdAccessToken, mangaId: MdMangaId, readingStatus: MdReadingStatus | null): Promise<void> {
    await fetchMangaDex(getMangaReadingStatusEndpoint(apiUrl, mangaId), {
        method: 'POST',
        body: JSON.stringify({
            status: readingStatus,
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    })
}

// ----------------------------------------------------------------------------
// MARK: API Manga Read
// ----------------------------------------------------------------------------

export type MdReadMarkersResponse = {
    data: Array<MdChapterId>
}

export type MdReadMarkersPayload = {
    chapterIdsRead: Array<MdChapterId>
} | {
    chapterIdsUnread: Array<MdChapterId>
}

function getMangaCollectionReadMarkersEndpoint(apiUrl: string) {
    return `${apiUrl}/manga/read`
}

function getMangaReadMarkersEndpoint(apiUrl: string, mangaId: string) {
    return `${apiUrl}/manga/${mangaId}/read`
}

export async function fetchMangasReadChapters(apiUrl: string, accessToken: MdAccessToken, mangaIds: Array<MdMangaId>): Promise<Array<MdChapterId>> {
    if (mangaIds.length === 0) {
        return []
    }

    // Use different endpoint in singular case for better caching
    // Do not use fetchMangaDexByIds since this endpoint returns { data: string[] } instead of { results: string[] }
    if (mangaIds.length === 1) {
        const url = getMangaReadMarkersEndpoint(apiUrl, mangaIds[0])
        const res = await fetchMangaDex<MdReadMarkersResponse>(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        return res.data
    } else {
        const url = createSearchParamUrl(getMangaCollectionReadMarkersEndpoint(apiUrl), { ids: mangaIds }, 'bracket')
        const res = await fetchMangaDex<MdReadMarkersResponse>(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        return res.data
    }
}

export async function fetchMarkChaptersAsRead(apiUrl: string, accessToken: MdAccessToken, mangaId: MdMangaId, chapterIds: Array<MdChapterId>, markAsRead: boolean): Promise<void> {
    if (chapterIds.length === 0) {
        return
    }

    const MAX_MARKERS_PER_REQUEST = 200 // 10kb limit ~= 200 uuids
    const url = getMangaReadMarkersEndpoint(apiUrl, mangaId)

    for (let i = 0; i < chapterIds.length; i += MAX_MARKERS_PER_REQUEST) {
        const payload: MdReadMarkersPayload = markAsRead
            ? { chapterIdsRead: chapterIds.slice(i, i + MAX_MARKERS_PER_REQUEST) }
            : { chapterIdsUnread: chapterIds.slice(i, i + MAX_MARKERS_PER_REQUEST) }

        await fetchMangaDex(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        })
    }
}

// ----------------------------------------------------------------------------
// MARK: Helpers
// ----------------------------------------------------------------------------

export function getMangaDesc(mangaAttr?: MdManga['attributes'], language: MdLanguage = 'en'): string {
    const enDesc = mangaAttr?.description[language]
    if (enDesc) {
        return enDesc
    }

    const anyDesc = Object.values(mangaAttr?.description ?? {})[0]
    return anyDesc || 'No description available'
}

export function getMangaTitle(mangaAttr?: MdManga['attributes'], language: MdLanguage = 'en'): string {
    const year = mangaAttr?.year ?? 0
    const yearSuffix = year > 0
        ? ` (${year})`
        : ''

    const title = mangaAttr?.title[language]
    if (title) {
        return title + yearSuffix
    }

    for (const altTitle of mangaAttr?.altTitles ?? []) {
        for (const [language, titleString] of Object.entries(altTitle)) {
            if (language === language) {
                return titleString + yearSuffix
            }
        }
    }

    const anyAltTitle = Object.values(mangaAttr?.altTitles?.[0] ?? {})[0]
    return (anyAltTitle ?? 'Untitled Manga') + yearSuffix
}
