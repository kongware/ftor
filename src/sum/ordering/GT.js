"use strict";


// dependencies


const Ordering = require("./Ordering");


/**
 * @name greater than
 * @type nullary constructor
 */


const GT = ({type: Ordering, tag: "GT"});


module.exports = GT;