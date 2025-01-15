import React from 'react';
import { render } from 'react-nil';

global.React = React;

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
