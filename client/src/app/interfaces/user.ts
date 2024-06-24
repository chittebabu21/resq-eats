export interface User {
    userId: number,
    username: string,
    emailAddress: string,
    passwordHash: string,
    imageUrl?: string,
    verificationToken?: string,
    isVerified: 0 | 1,
    createdOn: Date
}
