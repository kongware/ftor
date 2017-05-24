"use strict";


// dependencies


const {$tag} = require("../interop");
const {compare, compare_} = require("../primitive/compare");
const {False} = require("../primitive/boo");
const I = require("../I");
const {K} = require("../K");
const {throw_} = require("../throw_");


/**
 * @name Option
 * @note Church encoded
 * @type sum type
 * @status stable
 */


const Option = {};


// constructors


/**
 * @name Some
 * @type constructor
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return (Some[$tag] = "Some", Some[$Option] = true, Some);
    };

    return (Some[$tag] = "Some", Some[$Option] = true, Some);
  };

 */


// a -> r -> (a -> r) -> r
const Some = x => {
  const Some = r => {
    const Some = f => f(x);
    return (Some[$tag] = "Some", Some[$Option] = true, Some);
  };

  return (Some[$tag] = "Some", Some[$Option] = true, Some);
};


Option.Some = Some;


// r -> (a -> r) -> r
const None = r => {
  const None = f => r;
  return (None[$tag] = "None", None[$Option] = true, None);
};


Option.None = None;


// API


module.exports = {Option, Some, None};