import { render } from 'react-nil';

export const renderInNode = (
  TrayComponent: React.ComponentType,
  ApplicationMenuComponent: React.ComponentType,
) =>
  render(
    <>
      <TrayComponent />
      <ApplicationMenuComponent />
    </>,
  );
