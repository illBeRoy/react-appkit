/**
 * @module layout
 * Layout components are files that are used to define the layout of the app's windows.
 * They can be defined under the "src/windows" folder, as "src/windows/.../[layout].tsx".
 * They cannot be used as standalone routes. Instead, they are applied around routes: the closest parent layout is used for the route.
 */

import type { LayoutProps } from '@react-appkit/runtime/renderer/layout';

export type { LayoutProps };
