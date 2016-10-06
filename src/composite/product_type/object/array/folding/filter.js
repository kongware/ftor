const apply = require("../../../../../polymorphic/application/apply");

module.exports = filter = f => xs => xs.filter(apply(f));