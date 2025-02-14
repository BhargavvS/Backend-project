class ApiResponse {
    constructor(
        message = "success",
        statusCode ,
        data = null,
    ){
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.success = statusCode < 400
    }
}

export { ApiResponse }