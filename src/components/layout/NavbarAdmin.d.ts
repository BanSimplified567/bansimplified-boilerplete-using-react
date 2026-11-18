interface NavbarAdminProps {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    mobileOpen: boolean;
    setMobileOpen: (value: boolean) => void;
    isMobile: boolean;
}
declare function NavbarAdmin({ isCollapsed, setIsCollapsed, mobileOpen, setMobileOpen, isMobile }: NavbarAdminProps): import("react").JSX.Element | null;
export default NavbarAdmin;
