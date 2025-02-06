import { fetchMangaDex } from '@/utils/fetchMangaDex.js'
import { MdMangaId } from './Manga.js'
import { MAX_IDS_PER_QUERY } from '@/api/Constants.js'
import { createSearchParamUrl } from '@/utils/createSearchParamUrl.js'

// ----------------------------------------------------------------------------
// MARK: API
// ----------------------------------------------------------------------------

export type MdMangaStatistic = {
    rating: {
        average: number
        distribution?: Record<number, number>
    }
    follows: number
}

export type MdMangaStatisticResponse = {
    statistics: Record<string, MdMangaStatistic>
}

function getStatisticCollectionEndpoint(apiUrl: string) {
    return `${apiUrl}/statistics/manga`
}

function getStatisticEndpoint(apiUrl: string, mangaId: string) {
    return `${apiUrl}/statistics/manga/${mangaId}`
}

export async function fetchMangaStatisticsByIds(apiUrl: string, mangaIds: Array<MdMangaId>): Promise<MdMangaStatisticResponse['statistics']> {
    if (mangaIds.length < 1) {
        return {}
    }

    if (mangaIds.length === 1) {
        const url = getStatisticEndpoint(apiUrl, mangaIds[0])
        const res = await fetchMangaDex<MdMangaStatisticResponse>(url)
        return res.statistics
    } else if (mangaIds.length < MAX_IDS_PER_QUERY) {
        const url = createSearchParamUrl(getStatisticCollectionEndpoint(apiUrl), { manga: mangaIds }, 'bracket')
        const res = await fetchMangaDex<MdMangaStatisticResponse>(url)
        return res.statistics
    } else {
        return {
            ...await fetchMangaStatisticsByIds(apiUrl, mangaIds.slice(0, MAX_IDS_PER_QUERY)),
            ...await fetchMangaStatisticsByIds(apiUrl, mangaIds.slice(MAX_IDS_PER_QUERY)),
        }
    }
}
