"use strict";

const arrayIterator = {};


arrayIterator.ArrayIterator = xs => {
  const aux = i => {
    const api = {};

    api.curr = f => xs[i];

    api.currKey = f => i;

    api.currPair = f => [i, xs[i]];

    api.look = n => xs[i + n];
    
    api.next = () => aux(i + 1);
    
    api.prev = f => xs[i - 1];

    api.prevKey = f => i - 1;

    api.prevPair = f => [i - 1, xs[i - 1]];

    api.iterable = { 
      [Symbol.iterator]: (j = i) => ({
        next: () => j in xs 
         ? {value: ++j, done: false}
         : {value: undefined, done: true}
      })
    };

    return k => k(api);
  };

  return aux(0);
};

api.curr = api => api.curr();


api.currKey = api => api.currKey();


api.currPair = api => api.currPair();


api.iterable = api => api.iterable;


api.look = n => api => api.look(n);


api.next = api => api.next();


api.prev = api => api.prev();


api.prevKey = api => api.prevKey();


api.prevPair = api => api.prevPair();


module.exports = {ArrayIterator, curr, currKey, currPair, iterable, look, next, prev, prevKey, prevPair};