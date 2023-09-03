const errorHandler = (err, req, res) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Handle validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
    }

    // Handle "not found" error
    if (err.message === 'Not Found') {
        statusCode = 404;
    }

    res.status(statusCode);
    res.json({
        message: err.message,
    });
};

module.exports = errorHandler;
