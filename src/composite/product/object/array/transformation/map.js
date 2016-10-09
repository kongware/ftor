const apply = require("../../../../../polymorphic/application/apply");

module.exports = map = f => as => as.map(apply(f));