const STATUSCODE = require('./http-codes')

/**
 * a class definition HttpError extending Error which has a constructor that allows message and http-status-code as .status attribute
 *
 * @author Johannes Konert
 * @licence MIT
 */

"use strict";
/**
 *  HttpError (based on prototype Error)
 * @param message {String} the error message
 * @param status {Number} valid HTTP Status code (will be available as public attribute .status)
 * @returns {HttpError} instance
 */
class HttpError extends Error {
    /**
     * Constructor
     * @param {String} message - The error message for the client
     * @param {Number} [status=500] - the HTTP status code to use
     */
    constructor(message, status = STATUSCODE.SERVER_ERROR) {
        super(message);
        if (status && !status instanceof Number) {
            throw "second parameter 'status' needs to be a Number, but is " + typeof (status);
        }
        else if (status !== STATUSCODE.SERVER_ERROR) { // otherwise this.status is the prototype attribute and saves memory
            this.status = status;
        }
    }
}
HttpError.prototype.status = STATUSCODE.SERVER_ERROR;

module.exports = HttpError;
