import {
  inherit,
  delegatedMethod,
  lte,
  equals,
  map,
  of,
  noop,
  aliasFor
} from './utils'

function Either() {}
function Left(a) {
  this.value = a
}
Left.prototype = inherit(Either.prototype)
Left.prototype.isLeft = true
Left.prototype.isRight = false

function Right(a) {
  this.value = a
}
Right.prototype = inherit(Either.prototype)
Right.prototype.isLeft = false
Right.prototype.isRight = true

Either.Left = function ELeft(x) {
  return new Left(x)
}
Either.prototype.Left = Either.Left

Either.Right = function ERight(x) {
  return new Right(x)
}
Either.prototype.Right = Either.Right

Either.safe = x => (x != null ? Either.Right(x) : Either.Left(x))
Either.prototype.safe = Either.safe

Either.of = a => Either.Right(a)
Either.prototype.of = Either.of

Left.prototype.ap = noop
Right.prototype.ap = function ap(x) {
  return x.map(this.value)
}

Left.prototype.map = noop
Right.prototype.map = function map(f) {
  return this.of(f(this.value))
}

Left.prototype.chain = noop
Right.prototype.chain = function chain(f) {
  return f(this.value)
}

Left.prototype.concat = noop
Right.prototype.concat = function concat(x) {
  return x.fold(
    () => x,
    y => this.Right(this.value.concat(y))
  )
}

Left.prototype.toString = function lToString() {
  return `Either.Left(${this.value})`
}
Right.prototype.toString = function rToString() {
  return `Either.Right(${this.value})`
}
Left.prototype.alt = function lAlt(x) {
  return x
}
Right.prototype.alt = function rAlt(_) {
  return this
}

Left.prototype.fold = function lFold(f, _) {
  return f(this.value)
}
Right.prototype.fold = function rFold(f, g) {
  return g(this.value)
}

Left.prototype.reduce = function lReduce(f, x) {
  return x
}
Right.prototype.reduce = function rReduce(f, x) {
  return f(x, this.value)
}

Left.prototype.extend = function lExtend(_) {
  return this
}
Right.prototype.extend = function rExtend(f) {
  return Either.Right(f(this))
}

Left.prototype.cata = function lCata(x) {
  return x.Left(this.value)
}
Right.prototype.cata = function rCata(x) {
  return x.Right(this.value)
}
Left.prototype.swap = function lSwap() {
  return this.Right(this.value)
}
Right.prototype.swap = function rSwap() {
  return this.Left(this.value)
}
Left.prototype.bimap = function lBimap(f, _) {
  return this.Left(f(this.value))
}
Right.prototype.bimap = function rBimap(f, g) {
  return this.Right(g(this.value))
}

// 5G
Left.prototype.lte = function lLTE(other) {
  return other.isRight || lte(this.value, other.value)
}
Right.prototype.lte = function rLTE(other) {
  return other.isRight && lte(this.value, other.value)
}

Left.prototype.equals = function lEquals(other) {
  return other.isLeft && equals(this.value, other.value)
}
Right.prototype.equals = function rEquals(other) {
  return other.isRight && equals(this.value, other.value)
}

const leftAliaser = aliasFor(Left.prototype)
const rightAliaser = aliasFor(Right.prototype)
const methods = [
  'map',
  'bimap',
  'ap',
  'chain',
  'alt',
  'reduce',
  'extend'
]
methods.map(leftAliaser)
methods.map(rightAliaser)

export default Either
