import type { MdCollectionResponse } from '../Response.ts'
import type { MdAccessToken } from './Auth.ts'
import { type MdChapterQuery, MD_FETCH_CHAPTERS_BASE_QUERY } from './Chapter.ts'
import { MD_FETCH_MANGA_BASE_QUERY, type MdMangaId, type MdMangaQuery } from './Manga.ts'
import { createSearchParamUrl } from '../../utils/createSearchParamUrl.ts'
import { fetchMangaDex } from '../../utils/fetchMangaDex.ts'

export type MdFollowsMangaListQuery = Pick<MdMangaQuery,
    | 'limit'
    | 'offset'

    | 'includes'
>

export type MdFollowsChapterFeedQuery = Pick<MdChapterQuery,
    | 'limit'
    | 'offset'

    | 'order[createdAt]'
    | 'order[updatedAt]'
    | 'order[publishAt]'
    | 'order[volume]'
    | 'order[chapter]'

    | 'translatedLanguage'
    | 'originalLanguage'
    | 'excludedOriginalLanguage'
    | 'contentRating'
    | 'includeFutureUpdates'

    | 'createdAtSince'
    | 'updatedAtSince'
    | 'publishAtSince'

    | 'includes'
>

// ----------------------------------------------------------------------------
// MARK: Followed Manga
// ----------------------------------------------------------------------------

function getUserFollowsEndpoint(apiUrl: string) {
    return `${apiUrl}/user/follows/manga`
}

export async function fetchUserFollows(apiUrl: string, accessToken: MdAccessToken, queryOverrides?: MdFollowsMangaListQuery): Promise<MdCollectionResponse<'manga'>> {
    const query: MdFollowsMangaListQuery = {
        ...MD_FETCH_MANGA_BASE_QUERY,
        ...queryOverrides,
    }

    const url = createSearchParamUrl(getUserFollowsEndpoint(apiUrl), query, 'bracket')
    const res = await fetchMangaDex<MdCollectionResponse<'manga'>>(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    return res
}

// ----------------------------------------------------------------------------
// MARK: Followed Chapters
// ----------------------------------------------------------------------------

function getUserFollowsFeedEndpoint(apiUrl: string) {
    return `${apiUrl}/user/follows/manga/feed`
}

export async function fetchUserFollowsFeed(apiUrl: string, accessToken: MdAccessToken, queryOverrides?: MdFollowsChapterFeedQuery): Promise<MdCollectionResponse<'chapter'>> {
    const query: MdFollowsChapterFeedQuery = {
        ...MD_FETCH_CHAPTERS_BASE_QUERY,
        ...queryOverrides,
    }

    const url = createSearchParamUrl(getUserFollowsFeedEndpoint(apiUrl), query, 'bracket')
    const res = await fetchMangaDex<MdCollectionResponse<'chapter'>>(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    return res
}

// ----------------------------------------------------------------------------
// MARK: Edit Follows
// ----------------------------------------------------------------------------

function geMangaIsFollowedEndpoint(apiUrl: string, mangaId: string) {
    return `${apiUrl}/user/follows/manga/${mangaId}`
}

function getMarkMangaAsFollowedEndpoint(apiUrl: string, mangaId: string) {
    return `${apiUrl}/manga/${mangaId}/follow`
}

export async function fetchIsMangaFollowed(apiUrl: string, accessToken: MdAccessToken, mangaId: MdMangaId): Promise<boolean> {
    try {
        await fetchMangaDex(geMangaIsFollowedEndpoint(apiUrl, mangaId), {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        return true
    } catch (err) {
        if (!(err instanceof Error)) {
            throw err
        }
        if (!err.message.includes('404')) {
            throw err
        }

        return false
    }
}

export async function fetchMarkMangaAsFollowed(apiUrl: string, accessToken: MdAccessToken, mangaId: MdMangaId, markAsFollowed: boolean): Promise<void> {
    await fetchMangaDex(getMarkMangaAsFollowedEndpoint(apiUrl, mangaId), {
        method: markAsFollowed
            ? 'POST'
            : 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
}
