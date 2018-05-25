# DHIS2 Data Quality App

[![Build Status](https://travis-ci.org/dhis2/data-reports-app.svg?branch=master)](https://travis-ci.org/dhis2/data-reports-app)

### Pre-requisites
* DHIS2 instance;
* node v9.3.0+;
* yarn v1.3.2+;

### Running the dev server
* Do a copy of file .env.template;
* Rename it .env.development.local;
* Update configurations at the new file according to your DHIS2 installation. For example:
    ```
    REACT_APP_DHIS2_BASE_URL=http://localhost:8080
    REACT_APP_DHIS2_API_VERSION=29
    ```
* add `http://localhost:3000` url to your DHIS2 CORS whitelist. (This can be done in the settings app);
* Update the proxy for your dhis2 instance at package.json. If your DHIS2 instance is at `http://localhost:3000`:
    ```json
    {
      "proxy": {
        "..": {
          "target": "http://localhost:8080"
        }
    }
    ```
* Execute the following commands:
    ```sh
    yarn install
    yarn start
    ```
    
    Due to a problem on Mac with lib node-gyp. It is possible you will need to execute the following command first:
        
     ```sh
     yarn global add node-gyp
     ```
         
    
* On the browser you are using login on DHIS2 instance you are using;
* Open your browser at `http://localhost:3000`;

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