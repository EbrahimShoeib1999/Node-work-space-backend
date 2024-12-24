class ResponseUtils {
    static success(res, message, data = null) {
        res.status(200).json({
            isSuccessful: true,
            message,
            data,
        });
    }

    static created(res, message, data = null) {
        res.status(201).json({
            isSuccessful: true,
            message,
            data,
        });
    }

    static error(res, errorCode, message, status = 500) {
        res.status(status).json({
            isSuccessful: false,
            message,
            error: {
                errorCode,
                message,
            },
        });
    }
}

module.exports = ResponseUtils;
