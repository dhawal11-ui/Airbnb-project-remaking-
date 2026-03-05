function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

module.exports = wrapAsync;

// there's a de
/*- catch {} → language construct for synchronous exceptions. You must call next(err) yourself.
- .catch() → promise method for asynchronous rejections. It automatically supplies the error to the function you pass in.
 */
