const akeys = require("../reflection/keys");
const append_ = require("../../array/accumulation/append_");
const avalues = require("../../array/iteration/values");
const comp = require("../../../polymorphic/composition/comp");
const foldl = require("../../array/folding/foldl");

module.exports = values = o => comp(avalues) (foldl(acc => x => append_(acc) (o[x])) ([])) (akeys(o));