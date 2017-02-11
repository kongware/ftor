"use strict";

const compn = require("./compn");
const init = require("../../product/array/extract/init");
const last = require("../../product/array/extract/last");

module.exports = fs => x => y => z => compn([...init(fs), last(fs) (x) (y) (z)]);