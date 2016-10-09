const apply = require("../../../../../polymorphic/application/apply");

module.exports = every = f => as => as.every(apply(f));