const brand = Symbol()

export type Brand<T, B> = T & {
    readonly [brand]: B
}
