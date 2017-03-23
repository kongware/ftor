"use strict";


// dependencies


const Option = require("./Option");


/**
 * @name None
 * @type unary constructor
 * @example

   None(); // {type: Option, tag: "None"}

 */


// () -> Option
const None = () => ({type: Option, tag: "None"});


const NONE = None();


// API


module.exports = {None, NONE};