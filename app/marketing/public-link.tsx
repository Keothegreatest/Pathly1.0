import type {ComponentPropsWithoutRef} from 'react';

/** Public pages use document navigation. The current vinext production Link
 * shim throws during RSC prefetch/click; native links keep SSR routes usable,
 * including without JS, on refresh, and via browser history or a new tab. */
export default function PublicLink(props:ComponentPropsWithoutRef<'a'>){
 return <a {...props}/>;
}

