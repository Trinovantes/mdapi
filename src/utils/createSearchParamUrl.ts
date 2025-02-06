export type SearchParam = Record<string, Array<string> | string | boolean | number>
export type SearchParamArrayFormat = 'comma' | 'bracket' | 'none'

export function createSearchParamUrl(url: string, query?: SearchParam, arrayFormat: SearchParamArrayFormat = 'none', shouldEscapeKeys = false): string {
    let searchQuery = ''

    for (const [key, val] of Object.entries(query ?? {})) {
        const urlKey = shouldEscapeKeys
            ? encodeURIComponent(key)
            : key

        if (Array.isArray(val)) {
            switch (arrayFormat) {
                case 'comma': {
                    searchQuery += `&${urlKey}=${val.join(',')}`
                    break
                }
                case 'bracket': {
                    for (const arrVal of val) {
                        searchQuery += `&${urlKey}[]=${arrVal}`
                    }
                    break
                }
                case 'none': {
                    for (const arrVal of val) {
                        searchQuery += `&${urlKey}=${arrVal}`
                    }
                    break
                }
            }
        } else {
            searchQuery += `&${urlKey}=${val}`
        }
    }

    if (searchQuery.length > 0) {
        return `${url}?${searchQuery.substring(1)}`
    } else {
        return url
    }
}
