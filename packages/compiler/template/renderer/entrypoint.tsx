import ReactDOM from 'react-dom/client';
import { RendererProcessProvider } from '@react-appkit/runtime/renderer/Provider';
// @ts-expect-error this file is dynamically generated during build time
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RendererProcessProvider>
    <App />
  </RendererProcessProvider>,
);
