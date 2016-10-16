const apply = require("../../../../../polymorphic/primitive/A");

module.exports = some = f => xs => xs.some(apply(f));