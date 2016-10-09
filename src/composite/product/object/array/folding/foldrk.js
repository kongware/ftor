const init = require("../subarray/init");
const last = require("../destructuring/last");

// TODO: don't pass f with every iteration
module.exports = foldrk = f => acc => as => as[0] === undefined
 ? acc
 : f(last(as)) (acc) (acc => foldrk(f) (acc) (init(as)));