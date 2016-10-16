const apply = require("../../../../../polymorphic/primitive/A");

module.exports = every = f => xs => xs.every(apply(f));