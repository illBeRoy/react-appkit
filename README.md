<p align="center">
  <img src="logo.png" alt="logo" width="280" />
  <br />
  <br />
  The React meta-framework for rapidly building desktop apps.
</p>

## General
React-AppKit is a robust meta-framework designed to help you quickly create, iterate on, and deploy desktop applications compatible with Windows, macOS and Linux.

Key features include:
- 🚥 File-based routing
- 🧰 Manage app features, such as the tray icon and menu, through an intuitive React API
- ⚡️ Complete isolation of Node.js code from the UI, with a "server" actions-like interface
- ⏱️ Integrated Hot Module Replacement (HMR) support
- ⚒️ A toolchain that simplifies the process of building and running your app

## Getting Started
Get started by running the create-app command:
```sh
npm create react-appkit-app
```

This will guide you through the process of setting up your new app.

### Run your app
You can immediately run your app by running the following command:
```sh
npm run dev
```

The app will launch shortly after, and any changes you make is automatically reloaded via HMR.

## API
> This section is under construction. 🚧

### Window Routes
What is a window route? In React-AppKit, a window route is the main unit of UI container, similar to a "page" in a web app. You can find your window routes in the `src/windows` directory.

Similar to other meta-frameworks, React-AppKit uses file-based routing. This means that each file in the `src/windows` directory is treated as its own window route, which means you can either navigate to it in an existing window, or open it in a new one.

The default window can be found at `src/windows/index.tsx`, which is automatically shown when your app is launched (though this can be changed).

Window routes run in a browser-like environment, meaning that any browser-compatible code can be used. This also means that you cannot use Node.js APIs directly, only via Node Actions (more on this later).

The path to the window route is determined by the path to the file under the `src/windows` directory. Some examples:
1. `src/windows/index.tsx` -> `/`
2. `src/windows/about.tsx` -> `/about`
3. `src/windows/settings/index.tsx` -> `/settings`
4. `src/windows/settings/profile.tsx` -> `/settings/profile`

Window path can also include path parameters, for instance:
1. `src/windows/users/:id.tsx` -> `/users/123`, `/users/456`, etc.

#### Styling and Assets
You can use CSS Modules to style your window routes (by importing `*.module.css` files), as well as use any other assets (images, fonts, etc.) by importing them in your typescript or css files.

#### Layouts
If you want to apply a layout to a window or a group of windows, you can create a special file called `[layout].tsx` in any directory under `src/windows`.
Layout files allow you to wrap any window route with a common component, and look like this:

```tsx
import type { LayoutProps } from '@react-appkit/sdk/layout';

export default function DefaultLayout({ children }: LayoutProps) {
  return (
    <div>
      <h1>Title</h1>
      {children}
    </div>
  );
}
```

Every window route is wrapped in the nearest layout file. That is, if you have a layout file at the same directory as a window route file, it's used; If not, the layout file in the closest parent directory is used.

Layouts are also where you should apply style to the window frame. In order to control the appearance of your window's frame, you can use the `<Window />` components. These components expose various properties that allow to control the window's frame:

```tsx
import type { LayoutProps } from '@react-appkit/sdk/layout';
import { Window } from '@react-appkit/sdk/window';

export default function DefaultLayout({ children }: LayoutProps) {
  return (
    <>
      <Window>
        <Window.Title>My App</Window.Title>
        <Window.Dimensions
          width={800}
          height={600}
          x="50%"
          y="50%"
          origin="center"
        />
      </Window>
      {children}
    </>
  );
}
```

For a full list of all the Window components, see the [source](packages/sdk/src/window.tsx).

#### Routing and Navigation
React AppKit comes with a built-in navigation system, which allows you to do two main things:
1. Navigate to different views within the same window
2. Open and manage new windows

You can access the navigation API via the `useNavigation` hook, the `<Link />` component, and via the `window` SDK module.

When opening new windows, you can pass a "window channel". This identifier allows you to reuse the same window if already open. The main window is always channel `_top`.

```tsx
import { useNavigation, Link, usePathParams } from '@react-appkit/sdk/routing';

// Navigation
const navigation = useNavigation();
navigation.navigate('/about'); // Navigate to the about window
navigation.popup('/help'); // Opens a new window at /help
navigation.popup('/help', { target: 'secondary' }); // Opens a new window at /help, reuses the "secondary" channel if already open
navigation.close(); // Closes the current window
navigation.close({ target: 'secondary' }); // Closes the window at the "secondary" channel

// Link component
<Link to="/about">About</Link> // Navigates to the about window
<Link to="/about" target="_blank">About</Link> // Opens a new window at /about
<Link to="/help" target="secondary">Help</Link> // Opens a new window at /help, reuses the "secondary" channel if already open

// Window parameters
const params = usePathParams();
console.log(params.id); // if a there is a /users/:id.tsx file, and the current path is /users/123, the returned object will have a "id" property with the value "123"
```

Learn more about navigation: [source](packages/sdk/src/routing.tsx).

### Node Actions
Node actions are a way to write code that interacts with Node.js APIs. In order to create a Node action, create a new file in the `src/actions` directory. The file should export any number of async functions, and can be imported by any other part of your app. Example:

```ts
// src/actions/config.ts
import fs from 'node:fs/promises';

export async function readConfig() {
  const config = await fs.readFile('/config.json', 'utf-8');
  return JSON.parse(config);
}
```

Similar to how Server Actions work in other frameworks, you can import and use Node actions from any window route and still expect it to run in the main Node process and have access to all Node.js APIs:

```tsx
// src/windows/settings/index.tsx
import { readConfig } from '../../actions/config';

export default function Settings() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    readConfig().then(setConfig);
  }, []);

  return <div>{config}</div>;
}
```

### SDK
The SDK package is a collection of public runtime APIs to help you build your app.

Here is the complete list of modules:

- [`@react-appkit/sdk/app`](packages/sdk/src/app.ts) - Functions to control the app (e.g. `quit`)
- [`@react-appkit/sdk/config`](packages/sdk/src/config.ts) - Access the app's config file (`src/app.config.ts`)
- [`@react-appkit/sdk/devtools`](packages/sdk/src/devtools.tsx) - The `<Devtools />` component, which opens the dev tools console
- [`@react-appkit/sdk/dialog`](packages/sdk/src/dialog.ts) - Functions to use native dialogs (e.g. `alert`, `confirm`, `prompt`, `file`)
- [`@react-appkit/sdk/global`](packages/sdk/src/global.ts) - Access the [global state](#global-state)
- [`@react-appkit/sdk/hotkeys`](packages/sdk/src/hotkeys.ts) - The app's [global hotkeys](#global-hotkeys) builder
- [`@react-appkit/sdk/layout`](packages/sdk/src/layout.ts) - Helper types to help you write Layout components
- [`@react-appkit/sdk/menu`](packages/sdk/src/menu.ts) - Components to help you build the [application menu](#application-menu) (if you want to use the menu system)
- [`@react-appkit/sdk/routing`](packages/sdk/src/routing.tsx) - The `useNavigation` hook, the `<Link />` component, and other hooks related to navigation
- [`@react-appkit/sdk/tray`](packages/sdk/src/tray.ts) - Components to help you build the [tray icon](#tray-icon) (if you want to use the tray system)
- [`@react-appkit/sdk/window`](packages/sdk/src/window.tsx) - The `<Window />` component, and imperative API to control windows

### Global State
React AppKit provides a global state system, which allows you to share data between different parts of your app, regardless of which window or process it is in.

When used in a React component, the global state can be accessed via the `useGlobalState` hook:

```tsx
import { useGlobalState } from '@react-appkit/sdk/global';

export default function MyComponent() {
  const [count, setCount] = useGlobalState('count', 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Plus 1</button>
    </div>
  );
}
```

As you can see, the hook provides a state-like interface. It's also reactive, and will automatically re-render the component when the global state changes
from any other part of the app.

From a non-react context, you can access the global state via imperative API:

```ts
import { setGlobalState, getGlobalState } from '@react-appkit/sdk/global';

const count = await getGlobalState('count') ?? 0;
await setGlobalState('count', count + 1);
```

Learn more about navigation: [source](packages/sdk/src/routing.tsx).

### Tray Icon
If your app uses the tray system, you can create and control your own tray icon by creating a file called `src/tray.tsx`.

The tray file should export a default component that uses the `<Tray />` component to create the tray icon. For instance:

```tsx
// src/tray.tsx
import { Tray, TrayMenu, TrayMenuItem } from '@react-appkit/sdk/tray';
import glyphPng from './assets/glyph.png';

export default function TrayIcon() {
  return (
    <Tray icon={glyphPng}>
      <TrayMenu>
        <TrayMenuItem.Button label="About" onClick={() => { /* ... */ }} />
        <TrayMenuItem.Separator />
        <TrayMenuItem.Button label="Quit" onClick={() => quit()} />
      </TrayMenu>
    </Tray>
  );
}
```

A few notes:
1. The tray icon can use any image asset, which is automatically converted to the correct format for the current platform.
2. You can build and create your own tray menu using the `TrayMenu` and `TrayMenuItem` components.
3. The component completely supports React, meaning you can use all standard React hooks and features. That said, it runs in a **Node** environment, so you cannot use any browser-specific APIs.

Learn more about the tray system: [source](packages/sdk/src/tray.ts).

### Application Menu
If your app needs to use the platform's native menu system, you can create and control your own menu by creating a file called `src/menu.tsx`.

The menu file should export a default component that uses the set of menu components to create the application menu. For instance:

```tsx
// src/menu.tsx
import { ApplicationMenu, Menu, MenuItem } from '@react-appkit/sdk/menu';

export default function AppMenu() {
  return (
    <ApplicationMenu>
      <Menu title="File">
        <MenuItem.Button label="New" onClick={() => { /* ... */ }} />
        <MenuItem.Button label="Open" onClick={() => { /* ... */ }} />
        <MenuItem.Button label="Save" onClick={() => { /* ... */ }} />
        <MenuItem.Separator />
        <MenuItem.Button label="Quit" onClick={() => quit()} />
      </Menu>
      <Menu title="Edit">
        <MenuItem.Button label="Cut" onClick={() => { /* ... */ }} />
        <MenuItem.Button label="Copy" onClick={() => { /* ... */ }} />
        <MenuItem.Button label="Paste" onClick={() => { /* ... */ }} />
      </Menu>
    </ApplicationMenu>
  );
}
```

On both Windows and Linux, the menu appears in the top-left corner of the window frame. You can hide it on certain windows by including `<Window.Menu visible={false} />` in your layout file.

On macOS, the menu is displayed in the top-left corner of the screen as long as your app is focused.

Learn more about the menu system: [source](packages/sdk/src/menu.ts).

### Global Hotkeys
Certain apps need to define global hotkeys, which are shortcuts that can be used to trigger actions in the app regardless of whether the app is focused. You can define global hotkeys by creating a file called `src/hotkeys.ts`, using the hotkeys builder API and exporting its results as a default export:

```ts
// src/hotkeys.ts
import { hotkeys } from '@react-appkit/sdk/hotkeys';

export default hotkeys().addHotkey(['CmdOrCtrl', 'Shift', 'R'], () => {
  console.log('Hello from React AppKit!');
});
```

Learn more about the hotkeys system: [source](packages/sdk/src/hotkeys.ts).

### Startup Function
If there's code that needs to run before the app is ready, you can define a startup function by creating a file called `src/startup.ts`:

```ts
// src/startup.ts
export default async function () {
  console.log('Booting up...');
}
```

This function is executed in the main process, before the app is ready and before any windows are shown.

### App Config
This is a file that allows you to define the app's configuration. It's located at `src/app.config.ts`:

```ts
// src/app.config.ts
import { appConfig } from '@react-appkit/sdk/config';

export default appConfig({
  id: 'com.example.my-app',
  displayName: 'My App',
  buildTargets: ['mac', 'linux', 'win'],
});
```

Some of the properties are required:
1. `id`: The app's unique identifier (used by the OS).
2. `displayName`: The app's display name (human-readable).
3. `buildTargets`: The platforms to build the app for.

There are also some optional properties:
1. `singleInstance`: Whether the app should be a single instance. If true, the app will refocus the existing window instead of opening a new one when the user opens the app more than once.
2. `openWindowOnStartup`: Whether the app should open the window on startup. If set to false, the app will start in the background; you can still open the window at any point by calling the `createWindow` function.
3. `windowFrameType`: Whether the windows should use the platform's native frame, or a custom one (meaning that you design the frame as part of your Window or Layout components)

Learn more about the app config: [source](packages/sdk/src/config.ts).

Finally, to set the app's icon, simply add a file named `src/icon.png` to your project. This file will be automatically recognized and used during build.

## Tasks
### Running in Dev Mode
React AppKit comes with a built-in dev command, which allows you to run your app in dev mode and supports HMR. To start the dev server, run the following command:

```sh
npm run dev
```

### Building
You can build your app by running the following command:

```sh
npm run build
```

This will create a build of your app's source code in the `dist` directory. Note: this does not create an executable, but rather the necessary files to run your app when running `npm start`.

#### Creating executables
To create an executable, you can run the following command:

```sh
npm run pack
```

This will create an executable for your app in the `dist/binaries` directory.

## How it works

### General Architecture
1. At its core, the app is built on Electron.
2. We use Vite to compile the app's source code into three separate bundles: the main process, the renderer process, and the preload script.
3. Each bundle features a custom runtime that encapsulates the app's source code and facilitates interaction with the runtime.
4. To ensure that user code remains independent of Electron, we provide a set of APIs through the SDK package.

#### How window components work
Our runtime provides a unified react-dom app that wraps user code with all the necessary providers to run in context of a React-AppKit app.

This includes:
1. Routing (using `react-router-dom`)
2. Global State provider (that taps into the global state system)
3. Error boundary
4. IPC bridge (which allows invocation of Node Actions from the UI)

All the routing information is collected in build time using Vite's builtin glob import functionality.

Whenever a new window is created, the wrapper tells the app to boot up from the specified route.

#### How Node Actions work
Node functions are collected in build time using Vite's builtin glob import functionality, and provided to the main process init function, which is in charge of registering them.

In each and every window, we run a preload script that initializes a bridge to the main process (using electron's native APIs). This bridge allows the window to invoke any Node Action, as well as access the global state system and other built-in APIs such as the Dialog and Window management systems.

Finally, when building the renderer bundle, we polyfill imports from the `actions` directory to instead use the bridge. As a result, user code can import Node actions from any window route, get full types as if it was really imported, and still expect it to run in the main process and have access to all Node.js APIs without bundling the actual Node.js code into the renderer bundle.

#### How the Tray and Menu systems work
We provide a set of components that directly interact with Electron's native tray and menu systems. These components are rendered in the main process using a custom renderer, which is currently based on [`react-nil`](https://github.com/pmndrs/react-nil).
