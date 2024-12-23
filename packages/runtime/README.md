# @react-appkit/runtime

This module contains the runtime code for React AppKit. Essentially, it serves as the "engine" that wraps around the user's app code and runs it.

Currently, it's based on the [Electron](https://www.electronjs.org/) framework, but it aims to abstract this detail away, so that if one day we decide to switch to another framework or runtime, user code should still be compatible.

## Project Structure
The project consists of three main parts:

- `src/main`: This is the main process code that operates within the Node process of the application. It manages launching the app, handling user actions, managing the tray, creating the application menu, window management, and more.
- `src/renderer`: This refers to the renderer process code, which operates independently in each open window. It runs in a browser context and does not have direct access to Node APIs. This component is responsible for UI rendering, routing, and providing the "bridge" IPC API for communication between the main process and the renderer process.
- `src/shared`: This includes the shared code that is utilized by both the main and renderer processes.

## Build Output
No build step is required; this library is designed to be used directly by the app, and is built and bundled alongside it.

Learn more about React Appkit: https://github.com/illberoy/react-appkit