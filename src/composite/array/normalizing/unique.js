var afrom = require("./afrom");

module.exports = unique = xs => afrom(new Set(xs));