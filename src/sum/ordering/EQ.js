"use strict";


// dependencies


const Ordering = require("./Ordering");


/**
 * @name equal
 * @type nullary constructor
 */

// () -> EQ
const EQ = () => ({type: Ordering, tag: "EQ"});


const _EQ = EQ();


module.exports = {EQ, _EQ};