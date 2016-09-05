const every2 = require("../searching/every2");

module.exports = compare = f => xs => ys => xs.length === ys.length
 ? every2(x => y => f(x) (ys[y])) (xs)
 : false;