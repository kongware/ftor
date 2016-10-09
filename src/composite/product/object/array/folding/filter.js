const apply = require("../../../../../polymorphic/application/apply");

module.exports = filter = f => as => as.filter(apply(f));