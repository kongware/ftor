"use strict";

const getCtor = require("../reflect/getCtor");

module.exports = o => (...xs) => Object.assign(new (getCtor(o))(), o, ...xs);