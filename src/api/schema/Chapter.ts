import type { MdLanguage } from './Language.ts'
import type { MdContentRating, MdMangaId } from './Manga.ts'
import type { MdAttributeType, MdCollectionResponse, MdEntityResponse } from '../Response.ts'
import type { MdSortOrder } from './SortOrder.ts'
import type { MdScanlationGroupId } from './ScanlationGroup.ts'
import type { MdUploaderId } from './Uploader.ts'
import type { Brand } from '../../Brand.ts'
import { fetchMangaDex, fetchMangaDexByIds } from '../../utils/fetchMangaDex.ts'
import { createSearchParamUrl } from '../../utils/createSearchParamUrl.ts'

export type MdChapterAttributes = {
    title: string
    volume: string
    chapter: string | null
    translatedLanguage: MdLanguage
    externalUrl: string | null
    pages: number

    version: number
    createdAt: string
    updatedAt: string
    publishAt: string
}

export type MdChapterId = Brand<string, 'MdChapterId'>
export type MdChapter = MdEntityResponse<'chapter'>['data']

export type MdChapterQuery = Partial<{
    'limit': number
    'offset': number
    'ids': Array<MdChapterId>
    'includes': Array<MdAttributeType>

    'order[createdAt]': MdSortOrder
    'order[updatedAt]': MdSortOrder
    'order[publishAt]': MdSortOrder
    'order[volume]': MdSortOrder
    'order[chapter]': MdSortOrder

    'title': string
    'groups': Array<MdScanlationGroupId>
    'uploader': MdUploaderId
    'manga': MdMangaId
    'volume': Array<string>
    'chapter': Array<string>
    'translatedLanguage': Array<MdLanguage>
    'originalLanguage': Array<MdLanguage>
    'excludedOriginalLanguage': Array<MdLanguage>
    'contentRating': Array<MdContentRating>

    'includeFutureUpdates': '0' | '1'
    'includeEmptyPages ': '0' | '1'
    'includeFuturePublishAt': '0' | '1'
    'includeExternalUrl  ': '0' | '1'

    'createdAtSince': string
    'updatedAtSince': string
    'publishAtSince': string
}>

// ----------------------------------------------------------------------------
// MARK: API
// ----------------------------------------------------------------------------

function getChapterCollectionEndpoint(apiUrl: string) {
    return `${apiUrl}/chapter`
}

function getChapterEndpoint(apiUrl: string, chapterId: string) {
    return `${apiUrl}/chapter/${chapterId}`
}

export const MD_FETCH_CHAPTERS_BASE_QUERY: MdChapterQuery = {
    includeFutureUpdates: '0',
    translatedLanguage: [
        'en',
    ],
    includes: [
        'scanlation_group',
    ],
}

export async function fetchChaptersByIds(apiUrl: string, chapterIds: Array<MdChapterId>, queryOverrides?: MdChapterQuery): Promise<Array<MdChapter>> {
    const query: MdChapterQuery = {
        ...MD_FETCH_CHAPTERS_BASE_QUERY,
        ...queryOverrides,
    }

    return await fetchMangaDexByIds<'chapter'>(apiUrl, getChapterCollectionEndpoint, getChapterEndpoint, chapterIds, query)
}

export async function fetchChapters(apiUrl: string, queryOverrides?: MdChapterQuery): Promise<MdCollectionResponse<'chapter'>> {
    const query: MdChapterQuery = {
        ...MD_FETCH_CHAPTERS_BASE_QUERY,
        ...queryOverrides,
    }

    const url = createSearchParamUrl(getChapterCollectionEndpoint(apiUrl), query, 'bracket')
    return await fetchMangaDex<MdCollectionResponse<'chapter'>>(url)
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

export function getChapterTitle(chapterAttr?: MdChapter['attributes']): string {
    if (!chapterAttr) {
        return ''
    }

    let name = chapterAttr.chapter
        ? `Chapter ${chapterAttr.chapter}`
        : 'One Shot'

    const title = chapterAttr.title
    if (title) {
        name += `: ${title}`
    }

    return name
}
