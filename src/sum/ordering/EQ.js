"use strict";


// dependencies


const Ordering = require("./Ordering");


/**
 * @name equal
 * @type nullary constructor
 */


const EQ = ({type: Ordering, tag: "EQ"});


module.exports = EQ;