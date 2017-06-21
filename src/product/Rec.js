"use strict";


// dependencies


const {$Rec} = require("../interop");


// CONSTRUCTOR


/**
 * @name Record
 * @note combined constructor/namespace
 * @type product type
 * @status stable
 */


// (...(String, *)) -> {String: *}
const Rec = (...pairs) => (pairs = pairs.reduce((o, pair) => (o[pair[0]] = pair[1], o), {}), pairs[$Rec] = true, pairs);


// SPECIFIC


// API


module.exports = Rec;