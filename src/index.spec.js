import Either from './index'

describe('Left', () => {
  let raw
  let inner
  beforeEach(() => {
    inner = Math.round(Math.random() * 1e5)
    raw = Either.Left(inner)
  })
  test('ap', () => {
    const double = x => x * 2
    expect(Either.Left(double).ap([1, 2, 3]).value).toEqual(double)
  })
  test('bimap', () => {
    const out = raw.bimap(
      x => x,
      y => y
    )
    expect(out.value).toEqual(inner)
  })
  test('cata', () => {
    const out = raw.cata(Either)
    expect(out.value).toEqual(inner)
  })
  test('chain', () => {
    expect(raw.chain(z => z * 2).value).toEqual(inner)
  })
  test('concat', () => {
    const value = Either.Left([1, 2, 3])
    expect(value.concat([2, 3, 4]).value).toEqual([1, 2, 3])
  })
  test('fold', () => {
    expect(
      raw.fold(
        a => a,
        b => b
      )
    ).toEqual(inner)
  })
  test('map', () => {
    expect(raw.map(z => 2 * z).value).toEqual(inner)
  })
  test('swap', () => {
    expect(raw.swap().map(y => y * 2).value).toEqual(inner * 2)
  })
  test('toString', () => {
    expect(raw.toString()).toEqual(`Either.Left(${raw.value})`)
  })
  test('alt', () => {
    const number = Math.round(Math.random() * 1e4)
    expect(raw.alt(number)).toEqual(number)
  })
  test('reduce', () => {
    expect(raw.reduce((_, __) => 'kang + kodos', 100)).toEqual(100)
  })

  test('extend', () => {
    expect(raw.extend(100)).toEqual(raw)
  })

  test('lte', () => {
    expect(raw.lte(Either.of(-1))).toBeFalsy()
    expect(raw.lte(Either.Left(-1))).toBeFalsy()
    expect(raw.lte(Either.of(1000))).toBeFalsy()
  })
  test('equals', () => {
    expect(raw.equals(Either.Left(inner))).toBeTruthy()
    expect(raw.equals(Either.Left(null))).toBeFalsy()
    expect(raw.equals(Either.Right(inner))).toBeFalsy()
    expect(raw.equals(Either.Right(null))).toBeFalsy()
  })
})

describe('Right', () => {
  let raw
  let inner
  beforeEach(() => {
    inner = Math.round(Math.random() * 1e5)
    raw = Either.Right(inner)
  })
  test('ap', () => {
    expect(Either.of(x => x * 2).ap([1, 2, 3])).toEqual([2, 4, 6])
  })
  test('bimap', () => {
    expect(
      raw.bimap(
        z => z + 's',
        z => z * 3
      ).value
    ).toEqual(inner * 3)
  })
  test('cata', () => {
    const out = raw.cata(Either)
    expect(out.value).toEqual(inner)
  })
  test('chain', () => {
    expect(raw.chain(z => z * 2)).toEqual(inner * 2)
  })
  test('concat', () => {
    const value = Either.Right([1, 2, 3])
    expect(value.concat(Either.of([2, 3, 4])).value).toEqual([
      1, 2, 3, 2, 3, 4
    ])
    expect(value.concat(Either.Left([2, 3, 4])).value).toEqual([
      2, 3, 4
    ])
  })
  test('fold', () => {
    expect(
      raw.fold(
        z => z,
        z => z * 2
      )
    ).toEqual(inner * 2)
  })
  test('map', () => {
    expect(raw.map(z => z * 3).value).toEqual(inner * 3)
  })
  test('swap', () => {
    expect(Either.isLeft(raw.swap())).toBeTruthy()
  })
  test('toString', () => {
    expect(raw.toString()).toEqual(`Either.Right(${inner})`)
  })
  test('alt', () => {
    const number = Math.round(Math.random() * 1e4)
    expect(raw.alt(number)).toEqual(raw)
  })
  test('reduce', () => {
    const rightArr = Either.of(100)
    expect(rightArr.reduce((x, y) => x + y, 100)).toEqual(200)
  })
  test('extend', () => {
    expect(raw.extend(x => x.value * 2)).toEqual(Either.of(inner * 2))
  })
  test('lte', () => {
    expect(raw.lte(Either.of(-1))).toBeFalsy()
    expect(raw.lte(Either.Right(1000))).toBeFalsy()
    expect(raw.lte(Either.Left(-1))).toBeFalsy()
  })
  test('equals', () => {
    expect(raw.equals(Either.Left(inner))).toBeFalsy()
    expect(raw.equals(Either.Left(null))).toBeFalsy()
    expect(raw.equals(Either.Right(inner))).toBeTruthy()
    expect(raw.equals(Either.Right(null))).toBeFalsy()
  })
})

describe('Either', () => {
  test('safe', () => {
    expect(Either.safe(null).isLeft).toBeTruthy()
    expect(Either.isRight(Either.safe(100))).toBeTruthy()
  })
  test('of', () => {
    expect(Either(200)).toEqual(undefined)
    expect(Either.of(null).isRight).toBeTruthy()
  })
  test('tryCatch', () => {
    const consumer = (args, e) => {
      if (e.message === `Cannot read property 'cool' of undefined`) {
        return `Safety wrapped!`
      }
      return e && e.message ? e.message : `Generic error`
    }
    const unsafeFn = (a, d) => a.cool[d]
    const safeFn = Either.tryCatch(consumer, unsafeFn)
    expect(() => safeFn(null, 'cool')).not.toThrow()
    expect(safeFn({}, 'cool').value).toEqual(`Safety wrapped!`)
  })
})
