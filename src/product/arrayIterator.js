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


arrayIterator.curr = api => api.curr();


arrayIterator.currKey = api => api.currKey();


arrayIterator.currPair = api => api.currPair();


arrayIterator.iterable = api => api.iterable;


arrayIterator.look = n => api => api.look(n);


arrayIterator.next = api => api.next();


arrayIterator.prev = api => api.prev();


arrayIterator.prevKey = api => api.prevKey();


arrayIterator.prevPair = api => api.prevPair();


module.exports = {ArrayIterator, curr, currKey, currPair, iterable, look, next, prev, prevKey, prevPair};