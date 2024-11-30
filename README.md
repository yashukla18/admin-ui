# Table of Contents

- [General Info](#general-info)
- [Technologies](#technologies)
- [Setup/Implementation](#setup/implementation)
- [Folder Structure](#folder-structure)
  - [Top Level](#top-level)
  - [Adding a new feature](#adding-a-new-feature)
  - [Adding components to a feature](#adding-components-to-a-feature)
- [Available Scripts](#available-scripts)
  - [pnpm test](#pnpm-test)
  - [pnpm build:[env]](#pnpm-build)
  - [pnpm local](#pnpm-local)

# General Info

The purpose of this project is to build/provide a UI for the admin experience and connect with the user-service api.

### Technologies

- React v18.2.0
- Typescript v5
- Zod
- [MUI](https://github.com/mui-org/material-ui)
- pnpm
- Emotion
- date-fns
- @youscience private npm packages
  - @youscience/user-service-common
  - @youscience/core
  - @youscience/theme
  - @youscience/hooks
  - @youscience/table

This project utilizes pnpm as a package manager. To install pnpm, run the following command:

# Setup/Implementation

Currently, development is using `node` and `pnpm`. You can find the current version utilized in this project in the `.tool-versions` file. If you have `asdf` installed, you can run `asdf install` to install the correct version of `node` and/or `pnpm`.

**If you don't have node installed, then install it locally: [nodejs](https://nodejs.org/en/download/) or via asdf [website](https://asdf-vm.com/guide/getting-started.html#_3-install-asdf)**
**If you don't have node installed, then install it locally: [nodejs](https://nodejs.org/en/download/) or via asdf [website](https://asdf-vm.com/guide/getting-started.html#_3-install-asdf)**

- If you're using asdf to control your node version for other projects, you may need to install nodejs version 20.5.0 and pnpm version 8.7.0:

  ```bash
  asdf install nodejs 20.5.0
  asdf install pnpm 8.7.0
  ```

  the .tool_versions file should default to this version but if you run into errors you can set your shell version via:

  ```bash
  asdf shell nodejs 20.5.0
  asdf shell pnpm 8.7.0
  ```

  Because our project has a .tool_versions file, asdf will automatically set your shell version to the version specified in the .tool_versions file. If you don't have a .tool_versions file, you can set your shell version via the above command.

  **Because our org npm packages are private**, you'll need to add a Read-only NPM_TOKEN variable to your `.npmrc` in order to install these dependencies successfully, if it's not already present.

1. Add a .npmrc file in root of the project (same level as your package.json) and add the following code (you'll need to get the `_authToken` from the admin of the repo, a fellow developer or generate your own **Read-only** token):

   ```
   //registry.npmjs.org/:_authToken=YOUR_NPM_TOKEN
   @youscience:registry=https://registry.npmjs.org/
   ```

2. Add `.env.local` file with the attributes copied from `.env.development`. Replace the VITE_ISP_SIGN_IN value with the following:

```bash
 VITE_ISP_SIGN_IN=https://signin.dev.youscience.com/?redirectUrl=http://admin.dev.youscience.com/organizations
```

3. Install dependencies

   ```bash
    pnpm install
   ```

4. Start project

   ```bash
   pnpm local
   ```

This will redirect you to the youscience login page at `https://signin.dev.youscience.com` where you can login with test credentials.

# Available Scripts

### `pnpm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `pnpm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

### `pnpm run dev`

Runs the project locally.

# Running different environments

Vite will automatically load the .env.development file when run locally unless you have a .env.local or .env.development.local file. When running different environments, you'll need to update the `allowedEnvs` variable in the `vite.config.ts` file. By default we're only allowing development and test environment files. Once the desired environment is provided, you'll be able to run the build script for that environment (e.g. pnpm run build:sandbox)

### Environments

- Dev (default)
- Sandbox
- Stage
- Production

When you run a specific environment locally `(pnpm run [environment])`, vite will load the desired environment file. If you'd like to have your own local version of this env, you can do so by having your own .local version (.env.sandbox.local). Just remember you'll need to keep your local environment file in sync.

### Hitting your locally run backend

- Update the .env file you're running locally or create/update .env.[desiredEnvironment].local file.
  - Update your API endpoints to include your sst stage name
  - https://apigw.sandbox.youscience.com/local-sst-stage
- update the allowedEnvs const in the vite.config.ts to include the desired environment

  - const allowedEnvs = ['development', 'test', 'sandbox'];

- pnpm run build:[environment]
- pnpm run [environment]

example env file

```
VITE_NODE_ENV=sandbox
VITE_API_ENDPOINT=https://apigw.sandbox.youscience.com/local-sst-stage
VITE_API_V2_ENDPOINT=https://apigw.youscience.com/local-sst-stage/v2
VITE_APP_URL=https://admin.sandbox.youscience.com/home
VITE_ISP_SIGN_IN=https://signin.sandbox.youscience.com/?redirectUrl=https://admin.sandbox.youscience.com/home
VITE_IDENTITY_URL=https://signin.sandbox.youscience.com
VITE_ROOT_ORG_ID='01860f43-7b3b-7fa6-91e4-4b271b365a7b'
VITE_ADMIN_TEST_ID='01886da1-cc03-7d7a-bf1f-d74f371d19a1'
VITE_GUS_API_ENDPOINT=https://apigw.sandbox.youscience.com/local-sst-stage
VITE_GUS_API_V2_ENDPOINT=https://apigw.sandbox.youscience.com/local-sst-stage/v2
VITE_CONFIG_API_ENDPOINT=https://apigw.sandbox.youscience.com/config
VITE_USER_IMPERSONATION='5eb45cf4-9d03-471a-9244-d0ce4483e743'
VITE_GTM_ID=GTM-NP6VVFN5
```

# Folder structure

This project adopts React Router Dom's v6.4.0 concept of utilizing a routes directory to house all of the routes for the application. This allows for a more modular approach to adding routes to the application. The `routes` directory is located in the src directory and replaces the commonly used `pages`/`views` directory in React applications.

Each route can be considered a page/view in the application. Each route should have its own directory that contains the following files:

- Required
  - index.ts file that exports your component
  - [FileName].tsx file that includes the code for your component
  - [FileName].types.ts to include your type/interface definitions
- Optional
  - [FileName].test.tsx to include your tests for that component
  - [FileName].styles.ts/\x to separate styles styles for that specific component.
  - constants.ts(x) to include any constants for that specific component.

### Top Level

Below is an example of how our file structure in the admin-ui project. This top level of directories within the src directory is code that can be re-used throughout the project.

```
admin-ui/
  README.md
  node_modules/
  build/
  src/
    components/
    constants/
    hooks/
      useSomeHook/
        useSomeHook.test.tsx
        useSomeHook.tsx
        index.ts -- used to export your hook
    layouts/
    routes/
    services/
    stores/
    utils/

    index.ts
```

### Adding a new feature

Below is an example of how your file structure should appear when creating a new `feature` within the project:

```
admin-ui/
  src/
    features/
      [FeatureName]/
        components/
        constants/
        hooks/
          useSpecificHook/ -- this is an example of a hook that is only used within this feature
            useSpecificHook.test.tsx
            useSpecificHook.tsx
            index.ts -- used to export your hook
        loaders/ --specific to features that need to load data before rendering the component
          [FeatureName]Loader.tsx
          index.ts -- used to import/export as a loader
        routes/
        services/
        stores/
        utils/
        [FeatureName].tsx
        index.ts
```

The idea is to keep all of the dependencies for a feature within the feature directory. This allows for a more modular approach to adding new features to the application. This also allows for our application to be more scalable and maintainable as we continue to add new features to the application. Breaking up our "pages" into smaller components, simplifies the process of conditionally rendering components to users based on their role/current access throughout the application.

It's important to note that your feature may not need all of these different directories. We should only add directories that are necessary for the feature. For example, if your feature doesn't need any custom hooks, then you don't need to add a hooks directory. If your feature doesn't need any custom components re-used throughout the feature, then you don't need to add a components directory.

```
admin-ui/
  src/
    features/
      [FeatureName]/ -- example of a bare minimum feature.
        loaders/ --specific to features that need to load data before rendering the component
          [FeatureName]Loader.tsx
          index.ts -- used to import/export as a loader
        routes/
        services/
        [FeatureName].tsx
        index.ts
```

### Adding components to a feature

I typically like to keep all of the components/styles related to my route nested within the parent component directory. For example:

```
admin-ui/
  src/
    features/
      organizations/
        loaders/
          organizationsLoader.tsx
          index.ts -- used to import/export as a loader
        OrganizationsTable/
          OrganizationsToolbar/
            OrganizationsToolbar.tsx
            index.ts -- used to export toolbar
          constants.tsx
          OrganizationsTable.tsx
          index.ts -- export default OrganizationsTable (default export for lazy loading)
```

Above you can see my organizations feature. This feature is responsible for displaying all of the organizations within the application. I have a `loaders` directory that contains all of the loaders for the feature to utilize react-router-dom's useLoaderData hook. I have a `OrganizationsTable` directory that contains all of the code related to the table. The `constants.tsx` file contains all of the constants for the table component including the column definitions. The `OrganizationsToolbar` directory contains all of the components related to the toolbar which is imported into the OrganizationsTable.tsx file. Note the OrganizationsToolbar shouldn't be lazily loaded because it's a requied component that renders no matter what within the OrganizationsTable.tsx file. I then have a top level `index.ts` file that default exports the OrganizationsTable component. This is used for lazy loading the component within the routes directory. Lazy loading is a concept that allows us to only load the code that is necessary for the user to view the page. This allows for a faster load time for the user and a better user experience. If the user never navigates to the organizations page, then the code for the organizations page will never be loaded. This is a concept that we should utilize throughout the application to improve performance.
