// Equivalent of @RestControllerAdvice GlobalExceptionHandler.java
// Express error middleware must have exactly 4 params: (err, req, res, next)

function errorHandler(err, req, res, next) {
    const status = err.status || 400;

    res.status(status).json({
        timestamp : new Date().toISOString(),
        status    : status,
        error     : err.message || 'An error occurred',
        details   : err.details || null,      // populated by validation errors
    });
}

module.exports = errorHandler;
