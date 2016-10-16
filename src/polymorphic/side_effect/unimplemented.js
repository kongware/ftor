const raise = require("./raise");

module.exports = unimplemented = () => raise(Error) ("function not implemented");