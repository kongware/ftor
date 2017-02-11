"use strict";

const getCtor = require("../reflect/getCtor");

module.exports = o => Object.assign(new (getCtor(o))(), o);