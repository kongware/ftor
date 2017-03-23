"use strict";


// dependencies


const Ordering = require("./Ordering");


/**
 * @name Greater Than
 * @type nullary constructor
 */


const GT = ({type: Ordering, tag: "GT"});


// API


module.exports = GT;