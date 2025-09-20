export const MD_OFFICIAL_SITES = [
    { label: 'Amazon', value: 'amz', getUrl: (val: string) => val },
    { label: 'BookWalker JP', value: 'bw', getUrl: (val: string) => `https://bookwalker.jp/${val}` },
    { label: 'eBook Japan', value: 'ebj', getUrl: (val: string) => val },
    { label: 'English Licensed Source', value: 'engtl', getUrl: (val: string) => val },
    { label: 'Raw', value: 'raw', getUrl: (val: string) => val },
] as const

export const MD_TRACKING_SITES = [
    { label: 'AniList', value: 'al', getUrl: (val: string) => `https://anilist.co/manga/${val}` },
    { label: 'Anime Planet', value: 'ap', getUrl: (val: string) => `https://www.anime-planet.com/manga/${val}` },
    { label: 'Kitsu', value: 'kt', getUrl: (val: string) => `https://kitsu.io/manga/${val}` },
    { label: 'Manga Updates', value: 'mu', getUrl: (val: string) => `https://www.mangaupdates.com/series.html?id=${val}` },
    { label: 'MyAnimeList', value: 'mal', getUrl: (val: string) => `https://myanimelist.net/manga/${val}` },
    { label: 'Novel Updates', value: 'nu', getUrl: (val: string) => `https://www.novelupdates.com/series/${val}` },
] as const

export type MdOfficialSite = (typeof MD_OFFICIAL_SITES[number])['value']
export type MdTrackingSite = (typeof MD_TRACKING_SITES[number])['value']
export type MdExternalSite = MdOfficialSite | MdTrackingSite

export function getSourceName(src: MdExternalSite): string {
    for (const site of MD_OFFICIAL_SITES) {
        if (src === site.value) {
            return site.label
        }
    }
    for (const site of MD_TRACKING_SITES) {
        if (src === site.value) {
            return site.label
        }
    }

    throw new Error(`Source "${src}" not implemented`)
}

export function getSourceUrl(src: MdExternalSite, val: string): string {
    for (const site of MD_OFFICIAL_SITES) {
        if (src === site.value) {
            return site.getUrl(val)
        }
    }
    for (const site of MD_TRACKING_SITES) {
        if (src === site.value) {
            return site.getUrl(val)
        }
    }

    throw new Error(`Source "${src}" not implemented`)
}
