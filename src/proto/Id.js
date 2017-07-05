"use strict";


/**
 * @name Identity
 * @note combined namespace/constructor
 * @type sum type
 * @revision 1
 */


// a -> Id a
function Id(x) {
  return new.target ? (this.x = x, this) : new Id(x)
}


// FOLDABLE


// Id a ~> (a -> b) -> b
Id.prototype.fold = function fold(f) {return f(this.x)};


// FUNCTOR


// Id a ~> (a -> b) -> Id b
Id.prototype.map = function map(f) {return new Id(f(this.x))};


// note: mutates to avoid intermediate objects
// Id a ~> (a -> b) -> Id b
Id.prototype.map_ = function map(f) {return this.x = f(this.x), this.x};


// APPLY


// Id (a -> b) ~> Id a -> Id b
Id.prototype.ap = function ap(t) {return new Id(this.x(t.x))};


// note: mutates to avoid intermediate objects
// Id (a -> b) ~> Id a -> Id b
Id.prototype.ap_ = function ap(tx) {return this.x = this.x(tx.x), this.x};


// MONAD


// Id a ~> (a -> Id b) -> Id b
Id.prototype.chain = function chain(ft) {return ft(this.x)};


// DEBUG


// Id a ~> () -> String
Id.prototype.toString = function toString() {return `Id(${this.x})`};


// SPECIFIC


// note: useful since identity pursuits no computational strategy
// Id (a -> b) ~> a -> Id b
Id.prototype.app = function app(x) {return new Id(this.x(x))};


// note: mutates to avoid intermediate objects
// Id (a -> b) ~> a -> Id b
Id.prototype.app_ = function app(x) {return this.x = this.x(x), this.x};


// API


module.exports = Id;