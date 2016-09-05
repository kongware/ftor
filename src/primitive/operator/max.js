const flip = require("../../polymorphic/argument/flip");
const min = require("./min");

module.exports = max = flip(min);