"use strict";

module.exports = (k, v) => f => ({key: k, value: v, next: f});