import { appConfig } from '@react-appkit/sdk/config';

export default appConfig({
  id: 'com.example.simple-app',
  displayName: 'Simple App',
  buildTargets: ['mac', 'linux', 'win'],
});
