import { setGlobalState } from '@react-appkit/sdk/global';

export default async function () {
  await setGlobalState('counter', 1);
}
