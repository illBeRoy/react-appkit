import ReactDOM from 'react-dom/client';
import { RendererProcessProvider } from '@react-appkit/runtime/renderer/Provider';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RendererProcessProvider>
    <App />
  </RendererProcessProvider>,
);
