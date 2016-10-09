const _append = require("../..object/array/accumulation/_append");
const comp = require("../../../../polymorphic/composition/comp");
const foldl = require("../..object/array/folding/foldl");
const keys = require("../reflection/keys");
const values = require("../..object/array/iteration/values");

module.exports = entries = o => comp(values) (foldl(acc => x => _append(acc) ([x, o[x]])) ([])) (keys(o));