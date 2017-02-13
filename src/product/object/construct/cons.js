"use strict";

module.exports = ctor => x => Reflect.construct(ctor, [x]);