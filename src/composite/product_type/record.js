const create2 = require("../object/create2");
const comp2 = require("../../../polymorphic/compostion/comp2");
const freeze = require("../polymorphic/construction/freeze");

module.exports = record = comp2(freeze) (create2);