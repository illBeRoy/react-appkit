import {
  Link as ReactRouterLink,
  useNavigate as useReactRouterNavigate,
  useParams as useReactRouterParams,
  useLocation as useReactRouterLocation,
} from 'react-router-dom';

export interface LinkProps {
  to: string;
  children: React.ReactNode;
}

export const Link = ({ to, children }: LinkProps) => {
  return <ReactRouterLink to={to}>{children}</ReactRouterLink>;
};

export const useNavigation = () => {
  const rrNavigate = useReactRouterNavigate();

  const navigate = (to: string) => {
    rrNavigate(to);
  };

  return {
    navigate,
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
