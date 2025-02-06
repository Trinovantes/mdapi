import { MAX_IDS_PER_QUERY, MAX_PAGINATION_RESULTS } from '@/api/Constants.js'

export type PaginationQuery = {
    offset: number
    limit: number
}

export function createPaginationQuery(page = 0, queryLimit: number): PaginationQuery {
    const offset = page * queryLimit
    const limit = Math.min(MAX_PAGINATION_RESULTS - offset, queryLimit)

    if (offset < 0 || limit < 0) {
        throw new Error(`Invalid offset:${offset} limit:${limit}`)
    }

    if (offset >= MAX_PAGINATION_RESULTS) {
        throw new Error(`Invalid offset ${offset} >= ${MAX_PAGINATION_RESULTS}`)
    }

    if (limit > MAX_IDS_PER_QUERY) {
        throw new Error(`Invalid limit ${limit} > ${MAX_IDS_PER_QUERY}`)
    }

    return {
        offset,
        limit,
    }
}
