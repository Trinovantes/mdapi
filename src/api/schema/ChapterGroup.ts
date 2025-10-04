import { findRelationship } from '../Response.ts'
import type { MdChapter, MdChapterId } from './Chapter.ts'
import type { MdMangaId } from './Manga.ts'

export type MdChapterGroup<K = string> = {
    key: K
    chapterIds: Array<MdChapterId>
}

export function createChapterComparator(): (a: MdChapter, b: MdChapter) => number {
    return (a, b) => {
        const aChapter = parseFloat(a.attributes.chapter ?? '0')
        const bChapter = parseFloat(b.attributes.chapter ?? '0')
        if (!isNaN(aChapter) && !isNaN(bChapter) && aChapter !== bChapter) {
            return (bChapter - aChapter)
        }

        const aPublishAt = a.attributes.publishAt
        const bPublishAt = b.attributes.publishAt
        if (aPublishAt !== bPublishAt) {
            return bPublishAt.localeCompare(aPublishAt)
        }

        return 0
    }
}

export function groupChaptersByChapter(chapters: Array<MdChapter>): Array<MdChapterGroup<string>> {
    const sortedChapters = chapters.sort(createChapterComparator())

    const groupedChapters: Array<MdChapterGroup<string>> = []
    let prevKey: string | undefined

    for (const chapter of sortedChapters) {
        const currentKey = chapter.attributes.chapter ?? '0'

        if (prevKey !== currentKey) {
            groupedChapters.push({
                key: currentKey,
                chapterIds: [],
            })
        }

        groupedChapters[groupedChapters.length - 1].chapterIds.push(chapter.id)
        prevKey = currentKey
    }

    return groupedChapters
}

export function groupChaptersByManga(chapters: Array<MdChapter>): Array<MdChapterGroup<MdMangaId>> {
    const groupedChapters = new Map<string, MdChapterGroup<MdMangaId>>()

    for (const chapter of chapters) {
        const currentKey = findRelationship(chapter, 'manga')?.id
        if (!currentKey) {
            throw new Error(`Missing manga relationship for chapter:${chapter.id}`)
        }

        if (!groupedChapters.has(currentKey)) {
            groupedChapters.set(currentKey, {
                key: currentKey,
                chapterIds: [],
            })
        }

        groupedChapters.get(currentKey)?.chapterIds.push(chapter.id)
    }

    return [...groupedChapters.values()]
}
