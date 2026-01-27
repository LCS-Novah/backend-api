

const asyncHandler = (fn) => (req, res, next) => {

  Promise.resolve(fn(req, res, next)).
  catch((err)=> next(err));

};

export default asyncHandler;

// ❓ Why Express doesn’t catch async errors automatically
// Because Express was designed before async/await existed, and it only understands synchronous errors by default.

// 👉 Express only understands errors passed via next()


// If a function is async and you don’t call next(error), Express will ignore the error
// ✔️ That’s because Express does NOT automatically handle rejected Promises (Express v4)
// ✔️ asyncHandler exists to catch rejected promises and forward them
// ✔️ next(error) tells Express: “An error happened”

// const asyncHandler = (fn) => async(req,res, next)=>{
//   try {
//     await fn(req,res,next);
//   } catch (error) {
//     console.log("ERROR in async handler", error);
//     next(error);
//     above line nexxt(error) will pass the error to express error handling middleware ,, otherwise the express will think that the request is still being processed and will hang 
//   }
// }