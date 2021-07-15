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

test('delegatedMethod', () => {
  function X(y) {
    this.cool = true
    this.value = y
    return this
  }
  X.prototype.crap = function crap(x) {
    this.cool = false
    return this
  }
  const output = delegatedMethod('crap', new X('dope'), new X('nah'))
  expect(output).toEqual({ cool: false, value: 'dope' })

  const output2 = delegatedMethod('crap', new Array(5), new X('nah'))
  expect(output2).toEqual({ cool: false, value: 'nah' })
})
test('lte', () => {
  expect(lte(4, 5)).toBeTruthy()
})
test('equals', () => {
  expect(equals(4, 4)).toBeTruthy()
})
test('map', () => {
  expect(map(x => x * 2, [1, 2, 3])).toEqual([2, 4, 6])
})
test('of', () => {
  function X(x) {
    this.crap = true
    this.inner = x
    return this
  }
  expect(of(X, 'dope')).toEqual({ crap: true, inner: 'dope' })
  function Y(x) {
    this.nice = 'cool'
    this.value = x
    return this
  }
  Y.of = function yof(x) {
    return new Y(x)
  }
  expect(of(Y, 'nice')).toEqual({ nice: 'cool', value: 'nice' })
  expect(of(null, null)).toBeFalsy()
})
test('noop', () => {
  function X() {
    this.crap = 'yep'
  }
  X.prototype.no = noop
  expect(new X().no()).toEqual(new X())
})
test('aliasFor', () => {
  function X() {
    this.crap = 'yep'
  }
  X.prototype.zipzop = function zoop() {
    this.crap = 'nope'
    return this
  }
  aliasFor(X.prototype)('zipzop')
  const xx = new X()
  expect(xx['fantasy-land/zipzop']().crap).toEqual('nope')
})
