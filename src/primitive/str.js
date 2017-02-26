"use strict";

const str = {};


str.concat_ = (x, y) => x.concat(y);


str.concat = y => x => x.concat(y);


str.split_ = (x, y) => x.split(y);


str.split = y => x => x.split(y);


module.exports = str;