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

  const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});

  Obj.del = k => o => {
    const p = Object.assign({}, o);
    return k in o ? (delete p[k], p) : throw_(TypeError) ("unknown property ${0}") (I) (k);
  };

  const throw_ = cons => template => f => x => {
    throw new cons(render(template) (f(x)));
  };

  const render = template => (...args) => template.replace(/\$\{(\d+)}/g, (_, i) => args[i]);
  const I = x => x;

  const o = {x: 1, y: 2, z: 3},
   p = Obj.del("y") (o); // {x: 1, z: 3}

  console.assert(o !== p); // passes

 */


// String -> Object -> Object
Obj.del = k => o => {
  const p = Object.assign({}, o);
  return k in o ? (delete p[k], p) : throw_(TypeError) ("unknown property ${0}") (I) (k);
};


/**
 * @name destructive delete
 * @note impure
 * @type action
 * @status stable
 * @example

  const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});
  Obj.destructiveDel = k => o => k in o ? (delete o[k], o) : throw_(TypeError) ("unknown property ${0}") (I) (k);

  const throw_ = cons => template => f => x => {
    throw new cons(render(template) (f(x)));
  };

  const render = template => (...args) => template.replace(/\$\{(\d+)}/g, (_, i) => args[i]);
  const I = x => x;

  const o = {x: 1, y: 2, z: 3},
   p = Obj.destructiveDel("y") (o); // {x: 1, z: 3}

  console.assert(o === p) // passes

 */


// String -> Object -> Object
Obj.destructiveDel = k => o => k in o ? (delete o[k], o) : throw_(TypeError) ("unknown property ${0}") (I) (k);


/**
 * @name get
 * @type first order function
 * @status stable
 * @example

  const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});
  Obj.get = k => o => k in o ? o[k] : throw_(TypeError) ("unknown property ${0}") (I) (k);

  const throw_ = cons => template => f => x => {
    throw new cons(render(template) (f(x)));
  };

  const render = template => (...args) => template.replace(/\$\{(\d+)}/g, (_, i) => args[i]);
  const I = x => x;
  const o = {x: 1, y: 2, z: 3};

  Obj.get("y") (o); // 2
  Obj.get("foo") (o); // TypeError: unknon property foo

 */


// String -> Object -> a
Obj.get = k => o => k in o ? o[k] : throw_(TypeError) ("unknown property ${0}") (I) (k);


/**
 * @name get key
 * @note might return undefined
 * @type first order function
 * @status stable
 * @example

  const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});
  Obj.getk = v => o => Object.keys(o).find(k => o[k] === v);
  const o = {x: 1, y: 2, z: 3};

  Obj.getk(2) (o); // "y"
  Obj.getk(5) (o); // undefined

 */


// a -> Object -> String
Obj.getk = v => o => Object.keys(o).find(k => o[k] === v);


/**
 * @name get key or
 * @type first order function
 * @status stable
 * @example

  const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});
  
  Obj.getkOr = x => v => o => {
    const k = Object.keys(o).find(k => o[k] === v);
    return k === undefined ? x : k;
  }
  
  const o = {x: 1, y: 2, z: 3};

  Obj.getkOr(0) (2) (o); // "y"
  Obj.getkOr(0) (5) (o); // 0

 */


// a -> b -> Object -> a|String
Obj.getkOr = x => v => o => {
  const k = Object.keys(o).find(k => o[k] === v);
  return k === undefined ? x : k;
}


/**
 * @name has property
 * @type first order function
 * @status stable
 * @example

  const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});
  Obj.has = k => o => k in o;
  const o = {x: 1, y: 2, z: 3};

  Obj.has("x") (o); // true

 */


// String -> Object -> Boolean
Obj.has = k => o => k in o;


/**
 * @name has value
 * @type first order function
 * @status stable
 * @example

  const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});
  Obj.hasv = x => o => Object.keys(o).some(k => o[k] === x);
  const o = {x: 1, y: 2, z: 3};

  Obj.hasv(2) (o); // true

 */


// a -> Object -> Boolean
Obj.hasv = x => o => Object.keys(o).some(k => o[k] === x);


/**
 * @name length
 * @type first order function
 * @status stable
 * @example

  const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});
  Obj.len = o => Object.keys(o).length;
  const o = {x: 1, y: 2, z: 3};

  Obj.len(o); // 3

 */


// Object -> Number
Obj.len = o => Object.keys(o).length;


/**
 * @name lift
 * @type higher order function
 * @status stable
 * @todo use a pair tuple?
 * @example

  const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});
  Obj.lift2 = f => ([x, y]) => ({[x]: a, [y]: b}) => f(a) (b);

  const add = x => y => x + y;
  const o = {x: 1, y: 2, z: 3};

  Obj.lift2(add) (["x", "z"]) (o); // 4

 */


// (a -> b) -> String -> Object -> b
Obj.lift = f => x => ({[x]: a}) => f(a);


// (a -> b -> c) -> [String] -> Object -> c
Obj.lift2 = f => ([x, y]) => ({[x]: a, [y]: b}) => f(a) (b);


// (a -> b -> c -> d) -> [String] -> Object -> d
Obj.lift3 = f => ([x, y, z]) => ({[x]: a, [y]: b, [z]: c}) => f(a) (b) (c);


/**
 * @name map over a property
 * @note only for flat objects
 * @type higher order function
 * @status stable
 * @example

  const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});
  Obj.map = f => k => o => Object.assign({}, o, {[k]: f(o[k])});

  const sqr = x => x * x;
  const o = {x: 1, y: 2, z: 3};

  Obj.map(sqr) ("z") (o); // {x: 1, y: 2, z: 9}

 */


// (a -> b) -> String -> Object -> Object
Obj.map = f => k => o => Object.assign({}, o, {[k]: f(o[k])});


/**
 * @name set
 * @type first order function
 * @status stable
 * @todo use a pair tuple?
 * @example

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

  const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});
  Obj.destructiveSet = ([k, v]) => o => (o[k] = v, o);

  const o = {x: 1},
   p = Obj.destructiveSet(["y", 2]) (o); // {x: 1, y: 2}

  console.assert(o === p) // passes

 */


// String -> a -> Object -> Object
Obj.destructiveSet = ([k, v]) => o => (o[k] = v, o);


/**
 * @name subset
 * @type first order function
 * @status stable
 * @todo use a pair tuple?
 * @example

  const Obj = props => props.reduce((acc, [k, v]) => (acc[k] = v, acc), {});
  Obj.subset2 = ([x, y]) => ({[x]: a, [y]: b}) => ({[x]: a, [y]: b});
  const o = {x: 1, y: 2, z: 3};

  Obj.subset2(["x", "z"]) (o); // {x: 1, z: 3}

 */


// String -> Object -> Object
Obj.subset = x => ({[x]: a}) => ({[x]: a});


// [String] -> Object -> Object
Obj.subset2 = ([x, y]) => ({[x]: a, [y]: b}) => ({[x]: a, [y]: b});


// [String] -> Object -> Object
Obj.subset3 = ([x, y, z]) => ({[x]: a, [y]: b, [z]: c}) => ({[x]: a, [y]: b, [z]: c});


// API


module.exports = Obj;