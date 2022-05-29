const headers = require('./headers');

const errorHandler = (res, err) => {
    message = err ? err.message : "欄位未填寫正確，或無此 todo id_0529"
    res.writeHead(400, headers);
    res.write(JSON.stringify({
        "status": "failure",
        message
    }));
    res.end();
};

module.exports = errorHandler;