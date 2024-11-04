import { useContext, createContext, useEffect } from 'react';
import {
  setSize,
  setTitle,
  setPosition,
  centerWindow,
  setResizable,
  setMovable,
  setAlwaysOnTop,
  setFullScreen,
  setShowInTaskbar,
  close,
  show,
  hide,
  setClosable,
  setMinimizable,
  setMaximizable,
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
  }, [closable]);

  useEffect(() => {
    if (typeof minimizable === 'boolean') {
      setMinimizable(minimizable);
    }
  }, [minimizable]);

  useEffect(() => {
    if (typeof maximizable === 'boolean') {
      setMaximizable(maximizable);
    }
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

export const WindowCenter = () => {
  useWindowContext();

  useEffect(() => {
    centerWindow();
  }, []);

  return null;
};

export interface WindowResizableProps {
  resizable: boolean;
}

export const WindowResizable = ({ resizable }: WindowResizableProps) => {
  useWindowContext();

  useEffect(() => {
    setResizable(resizable);
  }, [resizable]);

  return null;
};

export interface WindowMovableProps {
  movable: boolean;
}

export const WindowMovable = ({ movable }: WindowMovableProps) => {
  useWindowContext();

  useEffect(() => {
    setMovable(movable);
  }, [movable]);

  return null;
};

export const WindowAlwaysOnTop = () => {
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
  }, [show]);

  return null;
};

export const closeWindow = () => close();
export const showWindow = () => show();
export const hideWindow = () => hide();

Window.Title = WindowTitle;
Window.Size = WindowSize;
Window.Position = WindowPosition;
Window.Center = WindowCenter;
Window.Resizable = WindowResizable;
Window.Movable = WindowMovable;
Window.AlwaysOnTop = WindowAlwaysOnTop;
Window.Fullscreen = WindowFullscreen;
Window.Taskbar = WindowTaskbar;
