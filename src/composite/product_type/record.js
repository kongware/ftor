const create = require("../object/create");
const comp = require("../../../ploymorphic/compostion/comp");
const seal = require("../seal");

module.exports = record = comp(seal) (create);