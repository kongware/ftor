"use strict";

const concat_ = require("../construct/concat_");
const foldl = require("../fold/foldl");

module.exports = xs => foldl(concat_) ([]) (xs);