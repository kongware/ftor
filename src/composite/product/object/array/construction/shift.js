const head = require("../subarray/head");
const tail = require("../destructuring/tail");

module.exports = shift = xs => [head(xs), tail(xs)];