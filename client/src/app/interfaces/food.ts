
export interface Food {
    food_id: number,
    food_name: string,
    price?: number,
    quantity: number,
    image_url: string | null,
    vendor_id: number,
    created_on: Date
}
