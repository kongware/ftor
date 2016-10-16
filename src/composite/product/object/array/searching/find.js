const apply = require("../../../../../polymorphic/primitive/A");

module.exports = find = f => xs => xs.find(apply(f));