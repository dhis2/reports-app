# DHIS2 Reports App

[![Build Status](https://travis-ci.com/dhis2/reports-app.svg?branch=master)](https://travis-ci.com/dhis2/reports-app)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdhis2%2Freports-app.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdhis2%2Freports-app?ref=badge_shield)

### Contributing

If you want to contribute to this code base, there is documentation in the docs directory.
You can start by reading the [general docs](./docs/general.md)

### Pre-requisites

-   DHIS2 instance;
-   node v9.3.0+;
-   yarn v1.3.2+;

### Running the dev server

-   Do a copy of file .env.template;
-   Rename it .env.development.local;
-   Update configurations at the new file according to your DHIS2 installation. For example:
    ```
    REACT_APP_DHIS2_BASE_URL=http://localhost:8080
    REACT_APP_DHIS2_API_VERSION=29
    ```
-   add `http://localhost:3000` url to your DHIS2 CORS whitelist. (This can be done in the settings app);

-   Execute the following commands:

    ```sh
    yarn install
    yarn start
    ```

-   On the browser you are using login on DHIS2 instance you are using;
-   Open your browser at `http://localhost:3000`;

### Building the project

To build a production version of the application run the following command:

```sh
yarn build
```

### Unit testing

To execute unit tests run the following command:

```sh
yarn test
```

### E2e testing

To execute end to end tests run the following command:

```sh
export DHIS2_BASE_URL=http://your_dhis2_instance.com/
yarn test-e2e
```

You must have the dev server running on port 3000, as explained previously.

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdhis2%2Freports-app.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdhis2%2Freports-app?ref=badge_large) [![Greenkeeper badge](https://badges.greenkeeper.io/dhis2/reports-app.svg)](https://greenkeeper.io/)
