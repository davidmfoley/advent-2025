import { expect, test } from 'vitest'
import { fileReader } from '../utils/fileReader'

type Range = [number, number]
type Predicate = (id: string) => boolean

const readFile = fileReader(__dirname)

const readRangeFile = (name: string) =>
  readFile(name)
    .split(',')
    .map((r) => r.split('-').map(Number)) as Range[]

const twoRepeats: Predicate = (s: string) => {
  return (
    s.length % 2 === 0 &&
    s.substring(0, s.length / 2) === s.substring(s.length / 2)
  )
}

const invalidIds = ([low, high]: Range, isInvalid: Predicate) => {
  let invalid = [] as number[]

  for (let current = low; current <= high; current++) {
    if (isInvalid(current.toString())) invalid.push(current)
  }
  return invalid
}

const sumInvalids = (ranges: Range[], isInvalid: Predicate) => {
  let sum = 0
  for (let range of ranges) {
    for (let id of invalidIds(range, isInvalid)) {
      sum += id
    }
  }
  return sum
}

let checkChunks = (s: string, chunkSize: number) => {
  if (s.length % chunkSize !== 0) return false
  let first = s.substring(0, chunkSize)

  for (let start = chunkSize; start < s.length; start += chunkSize) {
    const nextChunk = s.substring(start, chunkSize + start)

    if (nextChunk !== first) return false
  }
  return true
}

const anyRepeats: Predicate = (s) => {
  for (let chunkSize = 1; chunkSize <= s.length / 2; chunkSize++) {
    if (checkChunks(s, chunkSize)) return true
  }
  return false
}

test('read example input', () => {
  const ranges = readRangeFile('exampleInput.txt')
  expect(ranges.length).toEqual(11)
  expect(ranges[0]).toEqual([11, 22])
})

test('invalidIds with two repeats', () => {
  expect(invalidIds([11, 22], twoRepeats)).toEqual([11, 22])
  expect(invalidIds([95, 115], twoRepeats)).toEqual([99])
})

test('anyRepeats', () => {
  expect(anyRepeats('1')).toEqual(false)
  expect(anyRepeats('11')).toEqual(true)
  expect(anyRepeats('111')).toEqual(true)
  expect(anyRepeats('112')).toEqual(false)
  expect(anyRepeats('12345123451234512345')).toEqual(true)
})

test('part 1 with example input', () => {
  const ranges = readRangeFile('exampleInput.txt')
  expect(sumInvalids(ranges, twoRepeats)).toEqual(1227775554)
})

test('part 2 with example input', () => {
  const ranges = readRangeFile('exampleInput.txt')
  expect(sumInvalids(ranges, anyRepeats)).toEqual(4174379265)
})

test('answers', () => {
  const ranges = readRangeFile('input.txt')
  console.log('02 pt1', sumInvalids(ranges, twoRepeats))
  console.log('02 pt2', sumInvalids(ranges, anyRepeats))
})
