import { useSender } from '../actionsEngine/context';

export const openDevTools = async () => {
  const sender = useSender();
  sender.openDevTools();
};

export const closeDevTools = async () => {
  const sender = useSender();
  sender.closeDevTools();
};
