import { User } from "./user";

export interface Vendor {
    vendor_id: number,
    vendor_name: string,
    contact_no: string,
    address: string,
    image_url?: string,
    user_id: User
}
