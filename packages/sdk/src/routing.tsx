import {
  Link as ReactRouterLink,
  useNavigate as useReactRouterNavigate,
  useParams as useReactRouterParams,
  useLocation as useReactRouterLocation,
} from 'react-router-dom';
import { createNewWindow } from '@react-appkit/runtime/main/api/window';

export interface LinkProps {
  to: string;
  popup?: boolean;
  children: React.ReactNode;
}

export const Link = ({ to, popup = false, children }: LinkProps) => {
  return (
    <ReactRouterLink
      to={to}
      onClick={(e) => {
        if (popup) {
          e.preventDefault();
          createNewWindow(to);
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

  const popup = (to: string) => {
    return createNewWindow(to);
  };

  return {
    navigate,
    popup,
  };
};

export const usePathParams = <T extends string = string>() => {
  const params = useReactRouterParams<T>();
  return params;
};

export const usePath = () => {
  const path = useReactRouterLocation();
  return path.pathname;
};
