const asyncHandler = (responseHandler) => {
    return  (req,res,next) => {
    Promise.resolve(
        responseHandler(req,res,next)
    ).catch(
        (error) => {
            next(error)
        }
    )
}
}



export {asyncHandler}

// break down of the function .
// In this we are taking function as the input and giving it to the another function within it.
// const asyncHandler = () => {}
// const asyncHandler = (func) => { () => {} }
// const asyncHandler = (func) => () => {}

// const asyncHandler = (fn) => async (req,res,next) => {
//     try {
//          await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//              message: error.message,
//              success : false
//              });
//     }
// }