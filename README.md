# @marsio/vue3-lib-boilerplate

A Vue 3 component development scaffold

## Introduction

This project is a Vue 3 component development scaffold. It helps you quickly develop and build Vue 3 components by providing a command-line interface to create new component libraries. The scaffold supports TypeScript, JSX, and comes with a complete development toolchain.

### How It Works

The scaffold provides a command-line tool called `vgen` that you can use to create new Vue 3 component libraries. The tool copies a template to your target directory, updates the necessary files, and sets up the project for you.

### Key Features

- 📦 Support for Vue 3
- 🔨 TypeScript & JSX support
- 📐 ESLint & Prettier integration
- 🛠️ Complete build system
- 📚 Documentation generation
- 🔄 Hot reload during development
- 📊 Bundle analysis
- 🧪 Testing support
- 📈 Semantic versioning (semver)
- 📝 Changelog generation

### Commands

- **Create a new component library**: Use the `vgen` command to create a new component library.
  ```bash
  vgen --name my-component
  ```

- **Set default npm organization**: Use the `vgen set-org` command to set a default npm organization.
  ```bash
  vgen set-org my-org
  ```

- **Get current default npm organization**: Use the `vgen get-org` command to get the current default npm organization.
  ```bash
  vgen get-org
  ```

- **Reset default npm organization**: Use the `vgen reset-org` command to reset the default npm organization.
  ```bash
  vgen reset-org
  ```

- **Run in interactive mode**: Use the `vgen --interactive` command to run the tool in interactive mode.
  ```bash
  vgen --interactive
  ```

### Parameters

- `--name <name>`: Name of the new component library.
  ```bash
  vgen --name vue-my-lib
  ```

- `--org <org>`: Npm organization (overrides default).
  ```bash
  vgen --name my-component --org my-org
  ```

- `--component <name>`: Name of the component.
  ```bash
  vgen --name my-component --component MyComponent
  ```

- `--no-org`: Do not use any organization.
  ```bash
  vgen --name my-component --no-org
  ```

- `--path <path>`: Path to create the new component library.
  ```bash
  vgen --name my-component --path /path/to/directory
  ```

- `--interactive`: Run in interactive mode.
  ```bash
  vgen --interactive
  ```

### Script Logic

The main script (`script.js`) handles the following tasks:

1. **Prompting the user for input**: If the `--interactive` flag is set, the script will prompt the user for the npm organization, component library name, and component name.
2. **Loading default options**: The script loads default options from a configuration file (`.vgenconfig.json`) if it exists.
3. **Copying the template**: The script copies the template files to the target directory.
4. **Updating package.json**: The script updates the `package.json` file with the provided options.
5. **Replacing placeholders**: The script replaces placeholders in the template files with the provided options.
6. **Installing dependencies**: The script installs the project dependencies using `yarn`.
7. **Initializing Git and Husky**: The script initializes a Git repository and sets up Husky for Git hooks.

For more details, refer to the [`script.js`](script.js) file.

## Installation

To install @marsio/vue3-lib-boilerplate globally, run:
```bash
npm install -g @marsio/vue3-lib-boilerplate
```

## Notes

- Currently supports yarn.
- The default branch is main.

## Available Scripts (for generated component projects)

### Development Server

```bash
npm run dev
```
Starts the development server with hot reload.

### Build

```bash
npm run build
```
Builds the library for production.

### Documentation

```bash
npm run docs
```
Generates the documentation.

### Linting

```bash
npm run lint
```
Lints and fixes files.

### Clean

```bash
npm run clean
```
Cleans build directories.

### Analyze

```bash
npm run analyze
```
Analyzes bundle size.