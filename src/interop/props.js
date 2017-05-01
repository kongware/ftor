"use strict";


// general


const $tag = Symbol.for("ftor/tag");


// type specific


const $Const = Symbol.for("ftor/Const");
const $Ident = Symbol.for("ftor/Ident");
const $Ordering = Symbol.for("ftor/Ordering");


module.exports = {$tag, $Const, $Ident, $Ordering};