import ReactDOM from 'react-dom/client';
import { RendererProcessProvider } from './RendererProcessProvider';
import {
  createHashRouter,
  Outlet,
  RouterProvider,
  type RouteObject,
} from 'react-router-dom';
import type { LayoutProps } from './layout';

export interface RenderOptions {
  routes: Route[];
  layouts: Layout[];
}

export interface Route {
  path: string;
  component: React.ComponentType;
}

export interface Layout {
  path: string;
  component: React.ComponentType<LayoutProps>;
}

export const render = (options: RenderOptions) => {
  const layoutRoutes: RouteObject[] = [];
  options.layouts.forEach((layout) => {
    layoutRoutes.push({
      path: layout.path,
      children: [],
      Component: () => (
        <layout.component>
          <Outlet />
        </layout.component>
      ),
    });
  });

  const standaloneRoutes: RouteObject[] = [];
  options.routes.forEach((route) => {
    const matchingLayout = layoutRoutes.reduce<RouteObject | null>(
      (currentMatchingLayout, layout) => {
        if (
          layout.path &&
          route.path.startsWith(layout.path) &&
          (!currentMatchingLayout?.path ||
            layout.path.length > currentMatchingLayout.path.length)
        ) {
          return layout;
        }
        return currentMatchingLayout;
      },
      null,
    );

    if (matchingLayout) {
      matchingLayout.children?.push({
        path: route.path,
        Component: () => <route.component />,
      });
    } else {
      standaloneRoutes.push({
        path: route.path,
        Component: () => <route.component />,
      });
    }
  });

  console.log(layoutRoutes, standaloneRoutes);

  const router = createHashRouter([...layoutRoutes, ...standaloneRoutes]);

  function App() {
    return (
      <RendererProcessProvider>
        <RouterProvider router={router} />
      </RendererProcessProvider>
    );
  }

  return ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
};
