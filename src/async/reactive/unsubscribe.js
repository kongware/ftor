"use strict";

module.exports = (observe, target, type) => target.removeEventListener(type, observe, true);