"use strict";


// dependencies


//const {B_} = require("../B");


/**
 * @name Object
 * @note combined namespace/constructor
 * @type product type
 * @status stable
 */


const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});


/**
 * @name assign
 * @type first order function
 * @status stable
 * @example
 *

  const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});
  Obj.assign = os => Object.assign({}, ...os);

  const o = {x: 1}, p = {y: 2};
  Obj.assign([o, p]); // {x: 1, y: 2}

 */


Obj.assign = os => Object.assign({}, ...os);


/**
 * @name clone
 * @type first order function
 * @status stable
 * @example
 *

  const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});
  Obj.clone = o => Object.assign({}, o);

  const o = {x: true}
  const p = Obj.clone(o);

  console.assert(o !== p); // passes

 */


// Object -> Object
Obj.clone = o => Object.assign({}, o);


// API


module.exports = Obj;