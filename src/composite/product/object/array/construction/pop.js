const init = require("../subarray/init");
const last = require("../destructuring/last");

module.exports = pop = xs => [init(xs), last(xs)];