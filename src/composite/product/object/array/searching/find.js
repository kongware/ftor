const apply = require("../../../../../polymorphic/application/apply");

module.exports = find = f => as => as.find(apply(f));