const afrom = require("../construction/afrom");
const comp = require("../../../polymorphic/composition/comp");
const create = require("../../../abstract/set/create");

module.exports = unique = comp(afrom) (create);