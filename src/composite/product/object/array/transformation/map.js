const apply = require("../../../../../polymorphic/primitive/A");

module.exports = map = f => xs => xs.map(apply(f));