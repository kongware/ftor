const apply = require("../../../../../polymorphic/application/apply");

module.exports = some = f => as => as.some(apply(f));