const raise = require("./raise");

module.exports = unimplemented = () => raise(Error) ("type mismatch");