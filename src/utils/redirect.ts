// navigation.ts - Separate utility functions
export type NavigateFn = (opts: { to: string; replace?: boolean }) => Promise<void> | void;


export function getAppUrl(): string {
  const appUrl =
    import.meta.env.VITE_APP_URL ||
    (typeof window !== 'undefined'
      ? window.location.origin
      : '');

  if (!appUrl) {
    throw new Error('VITE_APP_URL is not defined.');
  }

  return appUrl.replace(/\/+$/, '');
}

export function buildRedirect(path: string): string {
  const safePath = path.startsWith('/')
    ? path
    : `/${path}`;

  return `${getAppUrl()}${safePath}`;
}

export const redirectByRole = (
  role: string = 'customer'
): string => {
  const elevatedRoles = ['admin', 'manager', 'staff'];

  return elevatedRoles.includes(role)
    ? '/dashboard'
    : '/index';
};


export const navigateToRole = async (
  navigate: NavigateFn,
  role: string
): Promise<string> => {
  const destination = redirectByRole(role || 'customer');
  await navigate({ to: destination, replace: true });
  return destination;
};
