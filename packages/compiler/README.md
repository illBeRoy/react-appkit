# @react-appkit/compiler

This is the CLI tool for React AppKit. It's used to build, start, run in dev mode (including hot reloading), and package the app for distribution.

The CLI uses [Vite](https://vitejs.dev/) under the hood to build the app, along with some custom plugins.

The CLI also uses [Electron Builder](https://www.electron.build/) to package the app for distribution when running the `pack` command.

## Project Structure
There are four main entrypoints:
- `src/build.ts`: Builds the app for production.
- `src/start.ts`: Starts the app in dev mode.
- `src/dev.ts`: Starts the app in dev mode with hot reloading.
- `src/pack.ts`: Packages the app for distribution.

Aside from these, there are two other parts:
- `src/builders/*` - various build functions for different parts of the app.
- `src/utils/vite/*` - custom Vite plugins used by the different builders.
- `templates/*` - templates for virtual entrypoints that are used as binding points between user code and the runtime.

## Build Output
The build step creates multiple entrypoints for the app, each for a different command, under the `dist/binaries` directory.
The resulting code is CJS, so it can be used in most Node.js environments.
