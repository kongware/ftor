const init = require("../subarray/init");
const last = require("../destructuring/last");

// TODO: don't pass f with every iteration
module.exports = foldrk = f => acc => xs => xs[0] === undefined
 ? acc
 : f(last(xs)) (acc) (acc => foldrk(f) (acc) (init(xs)));