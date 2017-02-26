"use strict";

const bool = {};


bool.not = x => !x;


bool.of = x => !!x;


module.exports = bool;