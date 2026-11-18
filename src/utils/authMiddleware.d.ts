interface AuthSuccessResponse {
    token: string;
    role: string;
    [key: string]: any;
}
export declare const authMiddleware: (pathname: string) => Promise<AuthSuccessResponse | null>;
export {};
