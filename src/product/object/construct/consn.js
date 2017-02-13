"use strict";

module.exports = ctor => xs => Reflect.construct(ctor, xs);