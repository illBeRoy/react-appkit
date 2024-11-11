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

export type LinkTarget = '_blank' | '_top' | (string & {});

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

export const useNavigation = () => {
  const rrNavigate = useReactRouterNavigate();

  const navigate = (to: string) => {
    rrNavigate(to);
  };

  const popup = (to: string, { target }: { target?: LinkTarget } = {}) => {
    const ifBlankThenNoChannel = target === '_blank' ? undefined : target;
    return createNewWindow(to, { channel: ifBlankThenNoChannel });
  };

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

export const usePath = () => {
  const path = useReactRouterLocation();
  return path.pathname;
};

export const usePathParams = <T extends string = string>() => {
  const params = useReactRouterParams<T>();
  return params;
};
