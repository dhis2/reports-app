const fakerData = {
    d2: {
        system: {
            major: 2,
            version: 30,
            snapshot: true,
        },
        Api: {
            getApi: () => ({ baseUrl: 'http://localhost:8080' }),
        },
    },
};

export default fakerData;

