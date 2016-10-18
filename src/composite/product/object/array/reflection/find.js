const A = require("../../../../../polymorphic/primitive/A");

module.exports = find = f => xs => xs.find((v, k) => f(v, k));