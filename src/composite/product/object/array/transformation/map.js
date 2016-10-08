const apply = require("../../../../../polymorphic/application/apply");

module.exports = map = f => xs => xs.map(apply(f));