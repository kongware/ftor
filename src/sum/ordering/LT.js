"use strict";


// dependencies


const Ordering = require("./Ordering");


/**
 * @name lower than
 * @type nullary constructor
 */

// () -> LT
const LT = () => ({type: Ordering, tag: "LT"});


const _LT = LT();


module.exports = {LT, _LT};