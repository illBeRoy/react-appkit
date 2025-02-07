/**
 * @module window
 * APIs to create, use and modify application windows.
 * Windows are the main containers of the app content, and are used to display visual UI to the user.
 */

import { useContext, createContext, useEffect } from 'react';
import {
  type WindowHandler,
  setTitle,
  setDimensions,
  setResizable,
  setMovable,
  setAlwaysOnTop,
  setFullScreen,
  setShowInTaskbar,
  setClosable,
  setMinimizable,
  setMaximizable,
  setWindowControlsVisibility,
  show,
  hide,
  createNewWindow as createNewWindowInternal,
  close as closeWindowInternal,
  setMenuBarVisibility,
} from '@react-appkit/runtime/main/api/window';
import { useLocation } from 'react-router-dom';
import { allowImportingOnlyOnMainProcess } from './utils/importBlockers';

const InWindowContext = createContext<boolean>(false);

const useWindowContext = () => {
  const context = useContext(InWindowContext);

  if (!context) {
    throw new Error(
      'This component must be used as a child of a Window component',
    );
  }

  return;
};

export interface WindowProps {
  children: React.ReactNode;
}

/**
 * The main component that hosts all of the other window components.
 * @example
 * ```tsx
 * <Window>
 *   <Window.Title>My window</Window.Title>
 * </Window>
 * ```
 *
 * @example
 * ```tsx
 * <>
 *   <Window>
 *     <Window.Title>My window</Window.Title>
 *   </Window>
 *   <div>Window Content! Do not put me inside the Window component, but as a sibling.</div>
 * </>
 * ```
 */
export const Window = ({ children }: WindowProps) => {
  // Since Window components can be rendered either in a layout or in a route,
  // we need to ensure that the layout windows are reapplied when the route changes.
  // This is due to the fact that a route can override the layout's Window, which is ok,
  // but when we move to another route that does not override the layout's Window,
  // we need to reapply the layout's Windows.
  // Using the pathname as a key ensures that the Window components are reapplied with each route change.
  const keyToEnsureReapplyingOfLayoutWindows = useLocation().pathname;

  return (
    <InWindowContext.Provider
      key={keyToEnsureReapplyingOfLayoutWindows}
      value={true}
    >
      {children}
    </InWindowContext.Provider>
  );
};

export interface WindowTitleProps {
  children?: string;
  closable?: boolean;
  minimizable?: boolean;
  maximizable?: boolean;
  showControls?: boolean;
}

/**
 * A component that can be used to set the title of the window, as well as the controls that can be found in the window's title bar.
 * @example
 * ```tsx
 * <Window.Title>My window</Window.Title>
 * ```
 *
 * @example
 * ```tsx
 * <Window.Title closable minimizable={false}>My window</Window.Title>
 * ```
 */
const WindowTitle = ({
  children,
  closable,
  minimizable,
  maximizable,
  showControls,
}: WindowTitleProps) => {
  useWindowContext();

  useEffect(() => {
    if (typeof children === 'string') {
      setTitle(children);
    }
  }, [children]);

  useEffect(() => {
    if (typeof closable === 'boolean') {
      setClosable(closable);
    }

    return () => {
      setClosable(true);
    };
  }, [closable]);

  useEffect(() => {
    if (typeof minimizable === 'boolean') {
      setMinimizable(minimizable);
    }

    return () => {
      setMinimizable(true);
    };
  }, [minimizable]);

  useEffect(() => {
    if (typeof maximizable === 'boolean') {
      setMaximizable(maximizable);
    }

    return () => {
      setMaximizable(true);
    };
  }, [maximizable]);

  useEffect(() => {
    if (typeof showControls === 'boolean') {
      setWindowControlsVisibility(showControls);
    }
  }, [showControls]);

  return null;
};

export interface WindowSizeProps {
  width: number | `${number}%`;
  height: number | `${number}%`;
}

export interface WindowDimensionsProps {
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  x?: number | `${number}%`;
  y?: number | `${number}%`;
  origin?: Exclude<Parameters<typeof setDimensions>[0], undefined>['origin'];
}

/**
 * A component that can be used to set the dimensions (size and position) of the window.
 * Note that width, height, x and y can be defined either in absolute pixels (number), or in percentage relative to the screen size (string).
 * In addition, the "origin" prop can be used to define the anchor point for the window's position.
 * @example
 * ```tsx
 * <Window.Dimensions width={500} height={300} x={100} y={100} />
 * ```
 *
 * @example
 * ```tsx
 * <Window.Dimensions width="25%" height="25%" x="25%" y="25%" origin="top-left" />
 * ```
 */
const WindowDimensions = ({
  width,
  height,
  x,
  y,
  origin,
}: WindowDimensionsProps) => {
  useWindowContext();

  useEffect(() => {
    setDimensions({ width, height, x, y, origin });
  }, [width, height, x, y, origin]);

  return null;
};

export interface WindowResizableProps {
  resizable: boolean;
}

/**
 * A component that can be used to set whether or not the window can be resized by the user.
 * @example
 * ```tsx
 * <Window.Resizable resizable={false} />
 * ```
 */
const WindowResizable = ({ resizable }: WindowResizableProps) => {
  useWindowContext();

  useEffect(() => {
    setResizable(resizable);

    return () => {
      setResizable(true);
    };
  }, [resizable]);

  return null;
};

export interface WindowMovableProps {
  movable: boolean;
}

/**
 * A component that can be used to set whether or not the window can be moved by the user.
 * @example
 * ```tsx
 * <Window.Movable movable={false} />
 * ```
 */
const WindowMovable = ({ movable }: WindowMovableProps) => {
  useWindowContext();

  useEffect(() => {
    setMovable(movable);

    return () => {
      setMovable(true);
    };
  }, [movable]);

  return null;
};

/**
 * A component that, if mounted, will make the window always stay on top of other windows.
 * @example
 * ```tsx
 * <Window.AlwaysOnTop />
 * ```
 */
const WindowAlwaysOnTop = () => {
  useWindowContext();

  useEffect(() => {
    setAlwaysOnTop(true);

    return () => {
      setAlwaysOnTop(false);
    };
  }, []);

  return null;
};

/**
 * A component that, if mounted, will make the window always stay in fullscreen mode.
 * @example
 * ```tsx
 * <Window.Fullscreen />
 * ```
 */
const WindowFullscreen = () => {
  useWindowContext();

  useEffect(() => {
    setFullScreen(true);

    return () => {
      setFullScreen(false);
    };
  }, []);

  return null;
};

export interface WindowTaskbarProps {
  show: boolean;
}

/**
 * A component that can be used to set whether or not the window should be shown in the taskbar.
 * @example
 * ```tsx
 * <Window.Taskbar show={false} />
 * ```
 */
const WindowTaskbar = ({ show }: WindowTaskbarProps) => {
  useWindowContext();

  useEffect(() => {
    setShowInTaskbar(show);

    return () => {
      setShowInTaskbar(true);
    };
  }, [show]);

  return null;
};

export interface WindowMenuProps {
  visible: boolean;
}

/**
 * A component that can be used to set whether or not the window should have a menu bar.
 * The menu bar, if visible, matches the application menu defined in the "src/menu.tsx" module.
 * Irrelevant on macOS.
 * @example
 * ```tsx
 * <Window.Menu visible={false} />
 * ```
 */
export const WindowMenu = ({ visible }: WindowMenuProps) => {
  useWindowContext();

  useEffect(() => {
    setMenuBarVisibility(visible);

    return () => {
      setMenuBarVisibility(true);
    };
  }, [visible]);

  return null;
};

/**
 * A function that can be used to show a window.
 */
export const showWindow = (window?: WindowHandler) => show(window);

/**
 * A function that can be used to hide a window.
 */
export const hideWindow = (window?: WindowHandler) => hide(window);

/**
 * A function that can be used to create new windows.
 * Note: this function cannot be called from Window components. For those, please use the "useNavigation" hook or the "<Link />" component from the "routing" module.
 */
export const createNewWindow = allowImportingOnlyOnMainProcess(
  createNewWindowInternal,
  'In order to open new windows from other windows, please import "useRouter" or the "<Link />" component from "@react-appkit/runtime/renderer/routing"',
);

/**
 * A function that can be used to close existing windows by their handler or channel.
 * Note: this function cannot be called from Window components. For those, please use the "useNavigation" hook or the "<Link />" component from the "routing" module.
 */
export const closeWindow = allowImportingOnlyOnMainProcess(
  closeWindowInternal,
  'In order to close windows from other windows, please import "useRouter" from "@react-appkit/runtime/renderer/routing"',
);

Window.Title = WindowTitle;
Window.Dimensions = WindowDimensions;
Window.Resizable = WindowResizable;
Window.Movable = WindowMovable;
Window.AlwaysOnTop = WindowAlwaysOnTop;
Window.Fullscreen = WindowFullscreen;
Window.Taskbar = WindowTaskbar;

export type { WindowHandler };
