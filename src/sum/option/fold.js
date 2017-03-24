"use strict";


// dependencies


const {cata} = require("./cata");


/**
 * @name fold
 * @type operator function
 * @example

   const safeInc = fold(x => x + 1) (() => 0);
   
   safeInc(Some(5)); // 6
   safeInc(None()); // 0

 */


// Function -> Function -> Option -> a
const fold = f => g => cata({Some: f, None: g});


// (Function, Function) -> Option -> a
const fold_ = (f, g) => cata({Some: f, None: g});


// API


module.exports = {fold, fold_};