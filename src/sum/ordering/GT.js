"use strict";


// dependencies


const Ordering = require("./Ordering");


/**
 * @name greater than
 * @type nullary constructor
 */

// () -> GT
const GT = () => ({type: Ordering, tag: "GT"});


const _GT = GT();


module.exports = {GT, _GT};