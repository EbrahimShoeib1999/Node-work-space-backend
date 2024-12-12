

class ApiErrorCode {

    static unknownError = 1000; // 500

    static validation = 1001; // 400

    static notFound = 1002; // 404

    static authorization = 1003; // 400

    static internalError = 1004; // 500
}
module.exports = ApiErrorCode