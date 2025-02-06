import { Brand } from '@/Brand.js'
import { findRelationship, mapResponseToRelationships, MdEntityResponse } from '../Response.js'
import { MdManga, MdMangaId } from './Manga.js'
import { fetchMangaDexByIds } from '@/utils/fetchMangaDex.js'

export type MdCoverAttributes = {
    volume: string | null
    fileName: string
    description: string | null

    version: number
    createdAt: string
    updatedAt: string
}

export type MdCoverId = Brand<string, 'MdCoverId'>
export type MdCover = MdEntityResponse<'cover_art'>['data']

// ----------------------------------------------------------------------------
// MARK: API
// ----------------------------------------------------------------------------

function getCoverCollectionEndpoint(apiUrl: string) {
    return `${apiUrl}/cover`
}

function getCoverEndpoint(apiUrl: string, coverId: string) {
    return `${apiUrl}/cover/${coverId}`
}

export async function fetchMangaCoverUrls(apiUrl: string, mangas: Array<MdManga>): Promise<Array<string>> {
    const coverIds = mapResponseToRelationships(mangas, 'cover_art', false).map((rel) => rel.id)
    const covers = await fetchMangaDexByIds<'cover_art'>(apiUrl, getCoverCollectionEndpoint, getCoverEndpoint, coverIds)
    const coverUrls = new Array<string>()

    for (const manga of mangas) {
        const mangaId = manga.id
        const cover = covers.find((cover) => findRelationship(cover, 'manga')?.id === mangaId)
        const coverUrl = getCoverUrl(mangaId, cover?.attributes)
        if (!coverUrl) {
            continue
        }

        coverUrls.push(coverUrl)
    }

    return coverUrls
}

// ----------------------------------------------------------------------------
// MARK: Helpers
// ----------------------------------------------------------------------------

export function getCoverUrl(mangaId: MdMangaId, coverAttributes?: MdCoverAttributes, size: '256' | '512' = '256'): string | null {
    if (!coverAttributes) {
        return null
    }

    const coverFileName = coverAttributes.fileName
    return `https://uploads.mangadex.org/covers/${mangaId}/${coverFileName}.${size}.jpg`
}
