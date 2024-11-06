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
  close,
  show,
  hide,
} from '@react-appkit/runtime/main/api/window';

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
  return (
    <InWindowContext.Provider value={true}>{children}</InWindowContext.Provider>
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

    return () => setClosable(true);
  }, [closable]);

  useEffect(() => {
    if (typeof minimizable === 'boolean') {
      setMinimizable(minimizable);
    }

    return () => setMinimizable(true);
  }, [minimizable]);

  useEffect(() => {
    if (typeof maximizable === 'boolean') {
      setMaximizable(maximizable);
    }

    return () => setMaximizable(true);
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

    return () => setResizable(true);
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

    return () => setMovable(true);
  }, [movable]);

  return null;
};

const WindowAlwaysOnTop = () => {
  useWindowContext();

  useEffect(() => {
    setAlwaysOnTop(true);

    return () => setAlwaysOnTop(false);
  }, []);

  return null;
};

const WindowFullscreen = () => {
  useWindowContext();

  useEffect(() => {
    setFullScreen(true);

    return () => setFullScreen(false);
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

    return () => setShowInTaskbar(true);
  }, [show]);

  return null;
};

export const closeWindow = (window?: WindowHandler) => close(window);
export const showWindow = (window?: WindowHandler) => show(window);
export const hideWindow = (window?: WindowHandler) => hide(window);

export type { WindowHandler };

Window.Title = WindowTitle;
Window.Size = WindowSize;
Window.Position = WindowPosition;
Window.Resizable = WindowResizable;
Window.Movable = WindowMovable;
Window.AlwaysOnTop = WindowAlwaysOnTop;
Window.Fullscreen = WindowFullscreen;
Window.Taskbar = WindowTaskbar;
