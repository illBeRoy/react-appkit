/**
 * @module routing
 * APIs to route between different windows in the app.
 * Using these APIs, you can navigate in the same window instance, or open & close other windows.
 */

import {
  Link as ReactRouterLink,
  useNavigate as useReactRouterNavigate,
  useParams as useReactRouterParams,
  useLocation as useReactRouterLocation,
} from 'react-router-dom';
import {
  createNewWindow,
  close as closeWindow,
  type WindowHandler,
} from '@react-appkit/runtime/main/api/window';

export interface LinkProps {
  to: string;
  target?: LinkTarget;
  children: React.ReactNode;
}

/**
 * Link targets are used to specify where to open a link in the app:
 * - `_blank` will open the link in a new window.
 * - `_top` will open the link in the first window that was created.
 * - Any other value will open the link in a new window at the specified "channel". If window with this channel already exists, it will be reused.
 */
export type LinkTarget = '_blank' | '_top' | (string & {});

/**
 * A component that can be used to navigate between different windows in the app.
 * Wrap it around elements that should be clickable to navigate to the specified route.
 * @example
 * ```tsx
 * <Link to="/">Home</Link>
 * ```
 *
 * @example
 * ```tsx
 * <Link to="/" target="_top">Open in the first window</Link>
 * ```
 *
 * @example
 * ```tsx
 * <Link to="/" target="editor">Open in a new window with the id "editor", or reuse if it already exists</Link>
 * ```
 */
export const Link = ({ to, target, children }: LinkProps) => {
  return (
    <ReactRouterLink
      to={to}
      onClick={(e) => {
        if (target) {
          e.preventDefault();
          if (target === '_blank') {
            createNewWindow(to);
          } else {
            createNewWindow(to, { channel: target });
          }
        }
      }}
    >
      {children}
    </ReactRouterLink>
  );
};

/**
 * A hook that can be used to navigate between different windows in the app.
 * @returns A router you can use to navigate in the current window, open new windows, and close them.
 */
export const useNavigation = () => {
  const rrNavigate = useReactRouterNavigate();

  const navigate = (to: string) => {
    rrNavigate(to);
  };

  /**
   * Opens a new window at the specified route.
   */
  const popup = (to: string, { target }: { target?: LinkTarget } = {}) => {
    const ifBlankThenNoChannel = target === '_blank' ? undefined : target;
    return createNewWindow(to, { channel: ifBlankThenNoChannel });
  };

  /**
   * Closes a window, either by its handler, or by its channel.
   * If no handler or channel is specified, the currently focused window is closed.
   */
  const close = ({
    window,
    target,
  }: {
    window?: WindowHandler;
    target?: LinkTarget;
  } = {}) => {
    const ifBlankThenNoChannel = target === '_blank' ? undefined : target;

    return closeWindow({
      window,
      windowAtChannel: ifBlankThenNoChannel,
    });
  };

  return {
    navigate,
    popup,
    close,
  };
};

/**
 * A hook that can be used to get the current path in the app (relative to "src/windows").
 */
export const usePath = () => {
  const path = useReactRouterLocation();
  return path.pathname;
};

/**
 * A hook that can be used to get the current path parameters in the app.
 * For instance, if current file is "src/windows/users/:userId.tsx", the returned object will have a "userId" property.
 */
export const usePathParams = <T extends string = string>() => {
  const params = useReactRouterParams<T>();
  return params;
};
