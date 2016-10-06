const akeys = require("../reflection/keys");
const append_ = require("../..object/array/accumulation/append_");
const avalues = require("../..object/array/iteration/values");
const comp = require("../../../../polymorphic/composition/comp");
const foldl = require("../..object/array/folding/foldl");

module.exports = values = o => comp(avalues) (foldl(acc => x => append_(acc) (o[x])) ([])) (akeys(o));