// ISO 639-1
export const MD_LANGUAGE_OPTIONS = [
    {
        label: 'English',
        value: 'en',
    },
    {
        label: 'Japanese',
        value: 'ja',
    },
    {
        label: 'Chinese',
        value: 'zh',
    },
    {
        label: 'Korean',
        value: 'ko',
    },
    {
        label: 'Spanish',
        value: 'es',
    },
    {
        label: 'French',
        value: 'fr',
    },
] as const

export type MdLanguage = (typeof MD_LANGUAGE_OPTIONS[number])['value']

export type MdLocalizedString = Partial<Record<MdLanguage, string>>
