export interface LoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    email: string;
    password: string;
    firstname?: string;
    lastname?: string;
}
export interface AuthResponse {
    success: boolean;
    message?: string;
    user?: any;
}
export declare const loginRequestSchema: {
    email: {
        required: boolean;
    };
    password: {
        required: boolean;
    };
};
export declare const registerRequestSchema: {
    email: {
        required: boolean;
    };
    password: {
        required: boolean;
    };
};
export declare const authResponseSchema: {
    success: {
        required: boolean;
    };
};
