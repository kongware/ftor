"use strict";


// dependencies


const succ = require("./succ");


/**
 * @name enumeration from
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const succ = ({tag}) => ({
     LT: EQ,
     EQ: GT,
     GT: null
   })[tag];

   const enumFrom = t => {
     const aux = (x, acc) => x === null
      ? acc
      : aux(succ(x), acc.concat(x));

     return aux(t, []);
   };

   enumFrom(LT); // [LT, EQ, GT]
   enumFrom(EQ); // [EQ, GT]

 */


// Number -> Ordering
const enumFrom = t => {
  const aux = (x, acc) => x === null
   ? acc
   : aux(succ(x), acc.concat(x));

  return aux(t, []);
};

// API


module.exports = enumFrom;