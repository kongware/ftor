const _append = require("../..object/array/accumulation/_append");
const comp = require("../../../../polymorphic/composition/comp");
const foldl = require("../..object/array/folding/foldl");
const keys = require("../reflection/keys");
const values = require("../..object/array/iteration/values");

module.exports = entries = kv => comp(values) (foldl(acc => a => _append(acc) ([a, kv[a]])) ([])) (keys(kv));