
import { redirectByRole } from './redirect';

export type NavigateFn = (opts: {
  to: string;
  replace?: boolean;
}) => Promise<void> | void;

export const navigateToRole = async (
  navigate: NavigateFn,
  role: string = 'customer'
): Promise<string> => {
  const destination = redirectByRole(role);

  await navigate({
    to: destination,
    replace: true,
  });

  return destination;
};
