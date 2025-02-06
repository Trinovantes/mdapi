import { createSearchParamUrl } from '../../utils/createSearchParamUrl.js'
import { fetchMangaDex } from '../../utils/fetchMangaDex.js'
import { MdChapterId } from './Chapter.js'

export type MdAtHomeResponse = {
    baseUrl: string
    chapter: {
        hash: string
        data: Array<string>
        dataSaver: Array<string>
    }
}

export type MdAtHomeQualityMode = 'data' | 'data-saver'

// ----------------------------------------------------------------------------
// MARK: API
// ----------------------------------------------------------------------------

function getAtHomeServerEndpoint(apiUrl: string, chapterId: string) {
    return `${apiUrl}/at-home/server/${chapterId}`
}

export async function fetchChapterPageUrls(apiUrl: string, chapterId: MdChapterId, qualityMode: MdAtHomeQualityMode = 'data'): Promise<Array<string>> {
    const url = createSearchParamUrl(getAtHomeServerEndpoint(apiUrl, chapterId), { forcePort443: true }, 'bracket')
    const res = await fetchMangaDex<MdAtHomeResponse>(url)
    const baseUrl = res.baseUrl
    const chapterHash = res.chapter.hash

    switch (qualityMode) {
        case 'data': {
            return res.chapter.data.map((fileName) => `${baseUrl}/${qualityMode}/${chapterHash}/${fileName}`)
        }
        case 'data-saver': {
            return res.chapter.dataSaver.map((fileName) => `${baseUrl}/${qualityMode}/${chapterHash}/${fileName}`)
        }
        default: {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw new Error(`qualityMode:${qualityMode} not implemented`)
        }
    }
}
