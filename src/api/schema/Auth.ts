import { Brand } from '@/Brand.js'
import { fetchMangaDex } from '../../utils/fetchMangaDex.js'

export type MdAccessToken = Brand<string, 'MdAccessToken'>
export type MdRefreshToken = Brand<string, 'MdRefreshToken'>

// ----------------------------------------------------------------------------
// MARK: Login
// ----------------------------------------------------------------------------

export type MdLoginPayload = {
    username: string
    password: string
}

export type MdLoginResponse = {
    access_token: MdAccessToken
    refresh_token: MdRefreshToken
}

export async function fetchLogin(apiUrl: string, payload: MdLoginPayload, headers?: Record<string, string>): Promise<MdLoginResponse> {
    return await fetchMangaDex<MdLoginResponse>(`${apiUrl}/realms/mangadex/protocol/openid-connect/token`, {
        method: 'POST',
        body: new URLSearchParams({
            grant_type: 'password',
            username: payload.username,
            password: payload.password,
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...headers,
        },
    })
}

// ----------------------------------------------------------------------------
// MARK: Refresh
// ----------------------------------------------------------------------------

export type RefreshResponse = {
    access_token: string
    refresh_token: string
}

export async function fetchRefreshToken(apiUrl: string, refreshToken: MdRefreshToken, headers?: Record<string, string>): Promise<RefreshResponse> {
    return await fetchMangaDex<RefreshResponse>(`${apiUrl}/realms/mangadex/protocol/openid-connect/token`, {
        method: 'POST',
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...headers,
        },
    })
}

// ----------------------------------------------------------------------------
// MARK: Check
// ----------------------------------------------------------------------------

export type MdUserCheckResponse = {
    isAuthenticated: boolean
    roles: Array<string>
    permissions: Array<string>
}

export async function fetchUserCheck(apiUrl: string, accessToken?: MdAccessToken): Promise<MdUserCheckResponse> {
    return await fetchMangaDex<MdUserCheckResponse>(`${apiUrl}/auth/check`, {
        headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
    })
}
