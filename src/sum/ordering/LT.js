"use strict";


// dependencies


const Ordering = require("./Ordering");


/**
 * @name lower than
 * @type nullary constructor
 */


const LT = ({type: Ordering, tag: "LT"});


module.exports = LT;