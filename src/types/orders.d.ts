export interface Order {
    order_id: string;
    user_id: string;
    order_number: string;
    status: 'Pending' | 'Completed' | 'Cancelled' | 'Refund' | 'Failed Delivery' | 'Returned' | 'Preparing' | 'Ready for Pickup' | 'Out for Delivery';
    total_amount: number;
    payment_method: string;
    payment_reference: string | null;
    delivery_firstname: string;
    delivery_lastname: string;
    delivery_phone: string;
    delivery_email: string;
    delivery_address: string;
    delivery_city: string;
    delivery_zipcode: string;
    estimated_prep_time: number | null;
    actual_done_time: number | null;
    created_at: string;
    updated_at: string;
}
