"use strict";


// dependencies


const Ordering = require("./Ordering");


/**
 * @name equal
 * @type constant
 * @status stable
 */


const EQ = ({type: Ordering, tag: "EQ"});


// API


module.exports = EQ;