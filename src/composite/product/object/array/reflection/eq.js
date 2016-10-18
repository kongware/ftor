const every = require("../folding/left/derived/every");

module.exports = eq = f => xs => ys => xs.length === ys.length
 ? every((v, k) => v === ys[k]) (xs)
 : false;