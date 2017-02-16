"use strict";

module.exports = type => target => observe => {
  target.addEventListener(type, observe, true);
  return f => f(observe, target, type);
};