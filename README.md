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

The default window can be found at `src/windows/index.tsx`:

```tsx
// todo: include example once create-appkit-app is launched
```

Window routes run in a browser-like environment, meaning that any react-dom compatible code can be used. This also means that you cannot use Node.js APIs directly, only via Node Actions (more on this later).

Window routes also support styling via CSS Modules.

#### The `<Window />` component
In order to control the appearance of your window's frame, you can use the `<Window />` component. These components expose 

#### Navigation

#### Layout components

### Node Actions

### Global State

### Tray Icon

### Application Menu

### Global Hotkeys

### Startup Function

### App Config

### Running in Dev Mode

### Building

#### Creating executables

## How it works

### General Architecture

#### Main and Renderer Processes

#### How Node Actions work

### The Build Process

