const append_ = require("../../array/accumulation/append_");
const comp = require("../../../polymorphic/composition/comp");
const foldl = require("../../array/folding/foldl");
const keys = require("../reflection/keys");
const values = require("../../array/iteration/values");

module.exports = entries = o => comp(values) (foldl(acc => x => append_(acc) ([x, o[x]])) ([])) (keys(o));