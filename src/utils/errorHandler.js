// 👉 Error middleware does NOT “correct” the error

// Instead, it:

// receives the error

// formats a response

// sends an appropriate HTTP response

// prevents the server from crashing

// The error already happened. The middleware just handles it gracefully.


class ErrorHandler extends Error {
  constructor(message = "Something went wrong", statusCode = 500,errors=[],stack="") {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = null;
    this.stack = statck;
    this.success = false;

    if (statck) {
      this.stack = stack;
    }
    else{
      Error.captureStackTrace(this, this.constructor); 
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;

