"use strict";


// dependencies


const Option = require("./Option");


/**
 * @name None
 * @type constructor
 * @example

   None(); // {type: Option, tag: "None"}

 */


// Option t => () -> t
const None = () => ({type: Option, tag: "None"});


const NONE = None();


// API


module.exports = {None, NONE};