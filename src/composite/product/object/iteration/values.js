const akeys = require("../reflection/keys");
const _append = require("../..object/array/accumulation/_append");
const avalues = require("../..object/array/iteration/values");
const comp = require("../../../../polymorphic/composition/comp");
const foldl = require("../..object/array/folding/foldl");

module.exports = values = kv => comp(avalues) (foldl(acc => a => _append(acc) (kv[a])) ([])) (akeys(kv));