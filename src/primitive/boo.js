"use strict";


// dependencies


const {K} = require("../K");


/**
 * @name Boolean
 * @note combined namespace/constructor
 * @type primitive type
 * @status stable
 */


const Boo = Boolean;


/**
 * @name False
 * @type first order function
 * @status stable
 * @example

  const K = x => _ => x;
  const False = K(false);

  False(true); // false

 */


// () -> Boolean
Boo.False = K(false);


/**
 * @name True
 * @type first order function
 * @status stable
 * @example

  const K = x => _ => x;
  const True = K(true);
   
  True(false); // true

 */


// () -> Boolean
Boo.True = K(true);


// API


module.exports = Boo;