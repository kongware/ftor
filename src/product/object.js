"use strict";

const {A} = require("../generic");

const {curry} = require("./Tuple");

const object = {};


object.union = p => o => Object.assign({}, o, p);


object.unionn = (...os) => Object.assign({}, ...os);


module.exports = object;