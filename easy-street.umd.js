(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.easystreet = factory());
}(this, (function () { 'use strict';

  const inherit = Object.create;

  function delegatedMethod(method, x, y) {
    if (x && x[method]) {
      return x[method](y)
    }
    if (y && y[method]) {
      return y[method](x)
    }
    return false
  }

  function lte(x, y) {
    const lessThanOrEqualTo = delegatedMethod('lte', x, y);
    if (lessThanOrEqualTo) {
      return lessThanOrEqualTo
    }
    if (x && x.value && y && y.value) {
      return x.value <= y.value
    }
    return x <= y
  }
  function equals(x, y) {
    const equal = delegatedMethod('equals', x, y);
    if (equal) {
      return equal
    }
    if (x && x.value && y && y.value) {
      return x.value === y.value
    }
    return x === y
  }
  function noop() {
    return this
  }
  function aliasFor(proto) {
    return key => {
      proto[`fantasy-land/${key}`] = proto[key];
      return proto
    }
  }

  function Either() {}
  function Left(a) {
    this.value = a;
  }
  Left.prototype = inherit(Either.prototype);
  Left.prototype.isLeft = true;
  Left.prototype.isRight = false;

  function Right(a) {
    this.value = a;
  }
  Right.prototype = inherit(Either.prototype);
  Right.prototype.isLeft = false;
  Right.prototype.isRight = true;

  Either.Left = function ELeft(x) {
    return new Left(x)
  };
  Either.prototype.Left = Either.Left;

  Either.Right = function ERight(x) {
    return new Right(x)
  };
  Either.prototype.Right = Either.Right;

  Either.safe = x => (x != null ? Either.Right(x) : Either.Left(x));
  Either.prototype.safe = Either.safe;

  Either.of = a => Either.Right(a);
  Either.prototype.of = Either.of;

  Left.prototype.ap = noop;
  Right.prototype.ap = function ap(x) {
    return x.map(this.value)
  };

  Left.prototype.map = noop;
  Right.prototype.map = function rMap(f) {
    return this.of(f(this.value))
  };

  Left.prototype.chain = noop;
  Right.prototype.chain = function chain(f) {
    return f(this.value)
  };

  Left.prototype.concat = noop;
  Right.prototype.concat = function concat(x) {
    return x.fold(
      () => x,
      y => this.Right(this.value.concat(y))
    )
  };

  Left.prototype.toString = function lToString() {
    return `Either.Left(${this.value})`
  };
  Right.prototype.toString = function rToString() {
    return `Either.Right(${this.value})`
  };
  Left.prototype.alt = function lAlt(x) {
    return x
  };
  Right.prototype.alt = function rAlt(_) {
    return this
  };

  Left.prototype.fold = function lFold(f, _) {
    return f(this.value)
  };
  Right.prototype.fold = function rFold(f, g) {
    return g(this.value)
  };

  Left.prototype.reduce = function lReduce(f, x) {
    return x
  };
  Right.prototype.reduce = function rReduce(f, x) {
    return f(x, this.value)
  };

  Left.prototype.extend = function lExtend(_) {
    return this
  };
  Right.prototype.extend = function rExtend(f) {
    return Either.Right(f(this))
  };

  Left.prototype.cata = function lCata(x) {
    return x.Left(this.value)
  };
  Right.prototype.cata = function rCata(x) {
    return x.Right(this.value)
  };
  Left.prototype.swap = function lSwap() {
    return this.Right(this.value)
  };
  Right.prototype.swap = function rSwap() {
    return this.Left(this.value)
  };
  Left.prototype.bimap = function lBimap(f, _) {
    return this.Left(f(this.value))
  };
  Right.prototype.bimap = function rBimap(f, g) {
    return this.Right(g(this.value))
  };

  // 5G
  Left.prototype.lte = function lLTE(other) {
    if (other && other.isRight) {
      return lte(this.value, other.value)
    }
    return false
  };
  Right.prototype.lte = function rLTE(other) {
    if (other && other.isRight) {
      return lte(this.value, other.value)
    }
    return false
  };

  Left.prototype.equals = function lEquals(other) {
    if (other && other.isLeft) {
      return equals(this.value, other.value)
    }
    return false
  };
  Right.prototype.equals = function rEquals(other) {
    if (other && other.isRight) {
      return equals(this.value, other.value)
    }
    return false
  };

  const leftAliaser = aliasFor(Left.prototype);
  const rightAliaser = aliasFor(Right.prototype);
  const methods = [
    'map',
    'bimap',
    'ap',
    'chain',
    'alt',
    'reduce',
    'extend'
  ];
  methods.map(leftAliaser);
  methods.map(rightAliaser);

  return Either;

})));
