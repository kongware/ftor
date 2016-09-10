const aof = require("../array/construction/aof");
const freeze = require("../freeze");

module.exports = tuple = (...args) => freeze(aof(...args));