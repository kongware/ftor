const apply = require("../../../../../polymorphic/primitive/A");

module.exports = filter = f => xs => xs.filter(apply(f));