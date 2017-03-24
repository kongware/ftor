"use strict";


// dependencies


const Option = require("./Option");


/**
 * @name None
 * @type constant constructor
 * @example

   None(); // {type: Option, tag: "None"}

 */


// () -> Option
const None = () => ({type: Option, tag: "None"});


const NONE = None();


// API


module.exports = {None, NONE};