interface UserData {
    role: string | null;
    status: string | null;
    id: string | null;
}
export declare const useUserData: () => {
    userData: UserData;
    hasSession: boolean;
    isLoading: boolean;
};
export default function RootLayoutDashboard(): import("react").JSX.Element;
export {};
