"use strict";


// dependencies


const Ordering = require("./Ordering");


/**
 * @name Equal
 * @type nullary constructor
 */


const EQ = ({type: Ordering, tag: "EQ"});


// API


module.exports = EQ;