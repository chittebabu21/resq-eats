export interface User {
    user_id: number,
    username: string,
    email_address: string,
    password_hash: string,
    image_url: string | null,
    verification_token?: string,
    is_verified: 0 | 1,
    created_on: Date
}
