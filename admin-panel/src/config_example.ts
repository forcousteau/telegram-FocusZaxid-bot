const config = {
    dev: {
        api: {
            useHTTPS: true,
            host: 'localhost',
            port: 80
        }
    },
    prod: {
        api: {
            useHTTPS: true,
            host: 'localhost',
            port: 8888
        }
    }
};

export default process.env.NODE_ENV === 'production' ? config.prod : config.dev;
