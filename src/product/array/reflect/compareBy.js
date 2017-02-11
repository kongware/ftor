const every = require("../iterate/every");

module.exports = compareBy = f => xs => ys => xs.length === ys.length
 ? every((v, k) => f(v) (ys[k])) (xs)
 : false;