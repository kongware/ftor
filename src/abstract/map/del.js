"use strict";


// dependencies


const clone = require("../clone") (Map);


/**
 * @name del
 * @note del_ is a destructive operation
 * @type operator function
 * @example

   ?

 */


// k -> Map -> Map
const del = k => map => (map = clone(map), map.delete(k), map);


// k -> Map -> Map
const del_ = k => map => (map.delete(k), map);


// API


module.exports = {del, del_};