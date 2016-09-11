const aof = require("../array/construction/aof");
const freeze = require("../polymorphic/construction/freeze");

module.exports = tuple = (...args) => freeze(aof(...args));