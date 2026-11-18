export type NavigateFn = (opts: {
    to: string;
    replace?: boolean;
}) => Promise<void> | void;
export declare const navigateToRole: (navigate: NavigateFn, role?: string) => Promise<string>;
