import { User } from "./user";

export interface Vendor {
    vendorId: number,
    vendorName: string,
    contactNo: string,
    address: string,
    imageUrl?: string,
    userId: User
}
