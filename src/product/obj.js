"use strict";


// dependencies


const I = require("../I");
const throw_ = require("../debug/throw_");


/**
 * @name Object
 * @note combined namespace/constructor
 * @type product type
 * @todo use pair tuples?
 * @status stable
 */


const Obj = pairs => pairs.reduce((acc, [k, v]) => (acc[k] = v, acc), {});


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


/**
 * @name delete
 * @type first order function
 * @status stable
 * @example
 *

  const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});

  Obj.del = k => o => {
    const p = Object.assign({}, o);
    return k in o ? (delete p[k], p) : throw_(TypeError) ("unknown property ${0}") (I);
  };

  const throw_ = cons => template => f => x => {
    throw new cons(render(template) (f(x)));
  };

  const I = x => x;

  const o = {x: 1, y: 2, z: 3},
   p = Obj.del("y") (o); // {x: 1, z: 3}

  console.assert(o !== p); // passes

 */


// String -> Object -> Object
Obj.del = k => o => {
  const p = Object.assign({}, o);
  return k in o ? (delete p[k], p) : throw_(TypeError) ("unknown property ${0}") (I);
};


/**
 * @name destructive delete
 * @note impure
 * @type action
 * @status stable
 * @example
 *

  const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});
  Obj.destructiveDel = k => o => k in o ? (delete o[k], o) : throw_(TypeError) ("unknown property ${0}") (I);

  const throw_ = cons => template => f => x => {
    throw new cons(render(template) (f(x)));
  };

  const I = x => x;

  const o = {x: 1, y: 2, z: 3},
   p = Obj.destructiveDel("y") (o); // {x: 1, z: 3}

  console.assert(o === p) // passes

 */


// String -> Object -> Object
Obj.destructiveDel = k => o => k in o ? (delete o[k], o) : throw_(TypeError) ("unknown property ${0}") (I);


/**
 * @name set
 * @type first order function
 * @status stable
 * @todo use a pair tuple?
 * @example
 *

  const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});
  Obj.set = ([k, v]) => o => Object.assign({}, o, {[k]: v});
  
  const o = {x: 1},
   p = Obj.set(["y", 2]) (o); // {x: 1, y: 2}

  console.assert(o !== p); // passes

 */


// [String, a] -> Object -> Object
Obj.set = ([k, v]) => o => Object.assign({}, o, {[k]: v});


/**
 * @name destructive set
 * @note impure
 * @type action
 * @status stable
 * @todo use a pair tuple?
 * @example
 *

  const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});
  Obj.destructiveSet = ([k, v]) => o => (o[k] = v, o);

  const o = {x: 1},
   p = Obj.destructiveSet(["y", 2]) (o); // {x: 1, y: 2}

  console.assert(o === p) // passes

 */


// String -> a -> Object -> Object
Obj.destructiveSet = ([k, v]) => o => (o[k] = v, o);


// API


module.exports = Obj;