const apply = require("../../../polymorphic/application/apply");

module.exports = find = f => xs => xs.find(apply(f));