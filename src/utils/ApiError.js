class ApiError extends Error {
    constructor(
        statusCode,
        message = "an error message",
        errors= [],
        stack = ""
    ){
        this.statusCode = statusCode
        this.message = message
        this.errors = errors
        this.data = null // study this line
        this.success = false

    if(stack){
        this.stack = stack
    } else{
        Error.captureStackTrace(this,this.constructor);
    }
}
}

export { ApiError }