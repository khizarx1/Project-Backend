const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error))
    }
}


export { asyncHandler }


// Higher order function :   esa function jo param mein ek function le aur ek function ko return b kry

// const asyncHandler = (fnc) => {() => {}}

// We can also can write like this

// const asyncHandler = (fnc) => async (req, res, next) => {
//     try {
//         await fnc(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({  // we use json for frontend dev
//             success: false,
//             message: error.message
//         })
//     }
// }