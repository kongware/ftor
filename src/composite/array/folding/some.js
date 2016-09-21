const apply = require("../../../polymorphic/application/apply");

module.exports = some = f => xs => xs.some(apply(f));