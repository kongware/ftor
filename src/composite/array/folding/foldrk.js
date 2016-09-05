const init = require("../slicing/init");
const last = require("../destructuring/last");

module.exports = foldrk = f => acc => xs => xs[0] === undefined
 ? acc
 : f(last(xs)) (acc) (acc => foldrk(f) (acc) (init(xs)));