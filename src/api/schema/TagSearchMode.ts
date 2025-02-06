export const MD_TAG_SEARCH_MODE_OPTIONS = [
    {
        label: 'All',
        value: 'AND',
    },
    {
        label: 'Any',
        value: 'OR',
    },
] as const

export type MdTagSearchMode = (typeof MD_TAG_SEARCH_MODE_OPTIONS[number])['value']
