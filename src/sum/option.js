"use strict";


// dependencies


const {A, I, raise_} = require("../generic");


// internal API


// external API


const Option = {};


// constructors


Some = x => ({type: Option, tag: "some", x: x});


None = () => ({type: Option, tag: "none"});


// general


module.exports = {Option: Option, Some: Some, None: None};