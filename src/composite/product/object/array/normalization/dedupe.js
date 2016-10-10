const afrom = require("../construction/afrom");
const comp = require("../../../../../polymorphic/composition/comp");
const createSet = require("../../../../abstract/set/createSet");

module.exports = dedupe = comp(afrom) (createSet);