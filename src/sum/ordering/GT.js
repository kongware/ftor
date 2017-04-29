"use strict";


// dependencies


const Ordering = require("./Ordering");


/**
 * @name greater than
 * @type constant
 * @status stable
 */


const GT = ({type: Ordering, tag: "GT"});


// API


module.exports = GT;