const aof = require("object/array/construction/aof");
const seal = require("object/construction/seal");

module.exports = tuple = (...args) => seal(aof(...args));