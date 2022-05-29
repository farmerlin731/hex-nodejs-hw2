const headers = require('./headers');

const successHandler = (res, datatmp) => {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
        "status": "success",
        datatmp
    }));
    res.end();
};

module.exports = successHandler;