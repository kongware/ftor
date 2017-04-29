"use strict";


// dependencies


const Ordering = require("./Ordering");


/**
 * @name lower than
 * @type constant
 * @status stable
 */


const LT = ({type: Ordering, tag: "LT"});


// API


module.exports = LT;