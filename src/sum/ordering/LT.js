"use strict";


// dependencies


const Ordering = require("./Ordering");


/**
 * @name Lower Than
 * @type nullary constructor
 */


const LT = ({type: Ordering, tag: "LT"});


// API


module.exports = LT;