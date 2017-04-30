"use strict";


// dependencies


const succ = require("./succ");
const pred = require("./pred");
const of = require("./of");
const formEnum = require("./fromEnum");
const enumFrom = require("./enumFrom");


/**
 * @name Enumeration
 * @note partial order
 * @type type representative
 * @status stable
 */


const Enum = {};


Enum.succ = succ;
Enum.pred = pred;
Enum.toEnum = of;
Enum.fromEnum = fromEnum;
Enum.enumFrom = enumFrom;


// API


module.exports = Enum;