import type { ComponentProps } from 'react';
import { TopBar } from './TopBar';

/** Encapsula la barra superior navegable del shell de la aplicación. */
export function Navbar(props: ComponentProps<typeof TopBar>) {
  return <TopBar {...props} />;
}
