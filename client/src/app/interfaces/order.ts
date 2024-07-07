import { User } from "./user";

export interface Order {
    order_id: number,
    amount_paid: number,
    user_id: number,
    order_status: string,
    ordered_on: Date,
    user?: User
}
