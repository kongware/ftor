"use strict";


// dependencies


const {compare, compare_} = require("./compare");
const {lt, lt_} = require("./lt");
const {lte, lte_} = require("./lte");
const {gt, gt_} = require("./gt");
const {gte, gte_} = require("./gte");
const min = require("./min");
const max = require("./max");


/**
 * @name Order
 * @note total order
 * @type type representative
 * @status stable
 */


const Ord = {};


Ord.compare = compare;
Ord.compare_ = compare_;
Ord.lt = lt;
Ord.lt_ = lt_;
Ord.lte = lte;
Ord.lte_ = lte_;
Ord.gt = gt;
Ord.gt_ = gt_;
Ord.gte = gte;
Ord.gte_ = gte_;
Ord.min = min;
Ord.max = max;


// API


module.exports = Ord;