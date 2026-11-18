export type NavigateFn = (opts: {
    to: string;
    replace?: boolean;
}) => Promise<void> | void;
export declare function getAppUrl(): string;
export declare function buildRedirect(path: string): string;
export declare const redirectByRole: (role?: string) => string;
export declare const navigateToRole: (navigate: NavigateFn, role: string) => Promise<string>;
