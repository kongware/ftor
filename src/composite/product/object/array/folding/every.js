const apply = require("../../../../../polymorphic/application/apply");

module.exports = every = f => xs => xs.every(apply(f));