"use strict";


// dependencies


const clone = require("../clone") (Map);


/**
 * @name set
 * @note set_ is a destructive operation
 * @type operator function
 * @example

   ?

 */


// ((k, v) -> a) -> Map -> Map
const set = pair => map => (map = clone(map), pair(map.set.bind(map)));


// ((k, v) -> a) -> Map -> Map
const set_ = pair => map => pair(map.set.bind(map));


// API


module.exports = {set, set_};