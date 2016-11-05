const Serializable = require("../../../newtype/Serializable");
const toString = require("../../../polymorphic/typecast/toString");

module.exports = Object.assign({}, Serializable, {
  toString: toString,
  toJSON: toString
};