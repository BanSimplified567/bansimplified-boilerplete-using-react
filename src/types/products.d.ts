export interface Product {
    product_id?: number;
    id?: number;
    name: string;
    type: string;
    subtype?: string;
    description?: string;
    temperature?: string;
    rating?: number;
    reviews?: number;
    caffeineLevel?: string;
    small_price?: string;
    original_price?: string;
    image?: string;
    prices?: {
        small: number;
        medium: number;
        large: number;
    };
    quantities?: {
        small: number;
        medium: number;
        large: number;
    };
    lowStockThreshold?: number;
    status: string;
}
