import type { PropsWithChildren } from 'react';
import { HashRouter } from 'react-router-dom';

export function AppProviders({ children }: PropsWithChildren) {
  return <HashRouter>{children}</HashRouter>;
}
