import { Food } from "./food";

export interface OrderDetails {
    order_detail_id: number,
    order_id: number,
    food_id: number,
    order_quantity: number,
    food?: Food
}
