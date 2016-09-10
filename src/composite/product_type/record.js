const create2 = require("../object/create2");
const comp2 = require("../../../ploymorphic/compostion/comp2");
const freeze = require("../freeze");

module.exports = record = comp2(freeze) (create2);