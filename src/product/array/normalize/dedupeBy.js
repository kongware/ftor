"use strict";

const afrom = require("../construct/afrom");
const foldl = require("../fold/foldl");
const destructivePush = require("../mutate/destructivePush");
const some = require("../iterate/some");

module.exports = f => foldl(
  acc => x => some(f(x)) (acc)
   ? acc
   : destructivePush(x) (acc)
) ([]);