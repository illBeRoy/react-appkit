import { useContext, createContext, useEffect } from 'react';
import {
  type WindowHandler,
  setSize,
  setTitle,
  setPosition,
  setResizable,
  setMovable,
  setAlwaysOnTop,
  setFullScreen,
  setShowInTaskbar,
  setClosable,
  setMinimizable,
  setMaximizable,
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
}

const WindowTitle = ({
  children,
  closable,
  minimizable,
  maximizable,
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

  return null;
};

export interface WindowSizeProps {
  width: number;
  height: number;
}

const WindowSize = ({ width, height }: WindowSizeProps) => {
  useWindowContext();

  useEffect(() => {
    setSize(width, height);
  }, [width, height]);

  return null;
};

export interface WindowPositionProps {
  x: number | `${number}%`;
  y: number | `${number}%`;
  origin?: Parameters<typeof setPosition>[2];
}

const WindowPosition = ({ x, y, origin }: WindowPositionProps) => {
  useWindowContext();

  useEffect(() => {
    setPosition(x, y, origin);
  }, [x, y, origin]);

  return null;
};

export interface WindowResizableProps {
  resizable: boolean;
}

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

export const showWindow = (window?: WindowHandler) => show(window);
export const hideWindow = (window?: WindowHandler) => hide(window);

export const createNewWindow = allowImportingOnlyOnMainProcess(
  createNewWindowInternal,
  'In order to open new windows from other windows, please import "useRouter" or the "<Link />" component from "@react-appkit/runtime/renderer/routing"',
);

export const closeWindow = allowImportingOnlyOnMainProcess(
  closeWindowInternal,
  'In order to close windows from other windows, please import "useRouter" from "@react-appkit/runtime/renderer/routing"',
);

Window.Title = WindowTitle;
Window.Size = WindowSize;
Window.Position = WindowPosition;
Window.Resizable = WindowResizable;
Window.Movable = WindowMovable;
Window.AlwaysOnTop = WindowAlwaysOnTop;
Window.Fullscreen = WindowFullscreen;
Window.Taskbar = WindowTaskbar;

export type { WindowHandler };
