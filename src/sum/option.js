"use strict";


// dependencies


const {A, I, raise_} = require("../generic");


// internal API


// external API


const Option = {};


// constructors


Some = x => ({type: Option, tag: "some", x: x});


None = () => ({type: Option, tag: "none"});


// misc


Option.cata = pattern => ({tag, x}) => pattern[tag](x);


// foldable


Option.fold = f => g => Option.cata({some: f, none: g});


module.exports = {Option: Option, Some: Some, None: None};