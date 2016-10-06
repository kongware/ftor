const create2 = require("../object/create2");
const comp2 = require("../../polymorphic/compostion/comp2");
const seal = require("object/construction/seal");

module.exports = record = comp2(seal) (create2);