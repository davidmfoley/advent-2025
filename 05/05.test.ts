import { expect, test } from 'vitest'
import { fileReader } from '../utils/fileReader'

type Range = [number, number]

interface FreshnessInput {
  ranges: Range[]
  ingredients: number[]
}

const parseFreshness = (s: string): FreshnessInput => {
  const numbersPerLine = s
    .split('\n')
    .filter(Boolean)
    .map((l) => l.split('-').map(Number))

  return {
    ranges: numbersPerLine.filter((l) => l.length === 2) as Range[],
    ingredients: numbersPerLine
      .filter((l) => l.length === 1)
      .map(([val]) => val),
  }
}

const readInputFile = fileReader(__dirname, parseFreshness)

const overlaps = ([al, ah]: Range, [bl, bh]: Range) => al <= bh && bl <= ah

const split = <T>(items: T[], predicate: (t: T) => boolean) => {
  const yes = [] as T[]
  const no = [] as T[]

  for (const item of items) {
    ;(predicate(item) ? yes : no).push(item)
  }
  return [yes, no]
}

const add = ([al, ah]: Range, [bl, bh]: Range): Range => [
  Math.min(al, bl),
  Math.max(ah, bh),
]

const combineOverlappingRanges = ([head, ...tail]: Range[]): Range[] => {
  if (tail.length === 0) return [head]

  const [overlapping, notOverlapping] = split(tail, (r) => overlaps(head, r))

  return overlapping.length
    ? combineOverlappingRanges([
        overlapping.reduce(add, head),
        ...notOverlapping,
      ])
    : [head, ...combineOverlappingRanges(tail)]
}

const part1 = (input: FreshnessInput) =>
  input.ingredients.filter((i) =>
    input.ranges.some(([l, h]) => i >= l && i <= h)
  ).length

const part2 = (input: FreshnessInput) =>
  combineOverlappingRanges(input.ranges).reduce(
    (sum, [low, high]) => sum + (high - low) + 1,
    0
  )

test('parse', () => {
  const input = readInputFile('exampleInput.txt')

  expect(input).toEqual({
    ranges: [
      [3, 5],
      [10, 14],
      [16, 20],
      [12, 18],
    ],
    ingredients: [1, 5, 8, 11, 17, 32],
  })
})

test('combineRanges no overlaps', () => {
  expect(
    combineOverlappingRanges([
      [1, 1],
      [3, 5],
    ])
  ).toEqual([
    [1, 1],
    [3, 5],
  ])
})

test('combineRanges subsumption', () => {
  expect(
    combineOverlappingRanges([
      [1, 10],
      [3, 5],
    ])
  ).toEqual([[1, 10]])
})

test('combineRanges intersection', () => {
  expect(
    combineOverlappingRanges([
      [1, 4],
      [3, 10],
    ])
  ).toEqual([[1, 10]])
})

test('combineRanges example input', () => {
  const input = readInputFile('exampleInput.txt')
  expect(combineOverlappingRanges(input.ranges)).toEqual([
    [3, 5],
    [10, 20],
  ])
})

test('part1 example input', () => {
  const input = readInputFile('exampleInput.txt')
  expect(part1(input)).toEqual(3)
})

test('part2 example input', () => {
  const input = readInputFile('exampleInput.txt')
  expect(part2(input)).toEqual(14)
})

test('amnswers', () => {
  const input = readInputFile('input.txt')
  console.log('05 pt 1', part1(input))
  console.log('05 pt 2', part2(input))
})
