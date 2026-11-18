interface ImportMetaEnv {
    readonly VITE_BACKEND_WS_BASE_URL: string;
    readonly VITE_BACKEND_BASE_URL: string;

    readonly PROD_SERVER_HOST: string;
    readonly PROD_SERVER_ALLOWED_HOST: string;

    readonly VITE_BRAND_NAME: string;

    readonly VITE_TOKEN_NAME: string;

    readonly VITE_API_KEY: string;

    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
    readonly VITE_GOOGLE_CLIENT_ID?: string;
    readonly VITE_GOOGLE_CLIENT_SECRET?: string;
    readonly VITE_GITHUB_CLIENT_ID?: string;
    readonly VITE_GITHUB_CLIENT_SECRET?: string;
    readonly VITE_APP_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}