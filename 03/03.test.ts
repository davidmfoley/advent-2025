import { expect, test } from 'vitest'
import { fileReader } from '../utils/fileReader'

const readInputFile = fileReader(__dirname, (s) => s.split('\n'))

const joltage = (batteryCount: number, line: string) => {
  const candidates = line.split('').map(Number)

  let digits = new Array(batteryCount).fill(-1)

  for (
    let candidateIndex = 0;
    candidateIndex < candidates.length;
    candidateIndex++
  ) {
    const remainingCandidates = candidates.length - candidateIndex
    const startIndex = batteryCount - remainingCandidates
    const candidate = candidates[candidateIndex]

    for (let digitIndex = startIndex; digitIndex < batteryCount; digitIndex++) {
      if (candidate > digits[digitIndex]) {
        digits = [
          ...digits.slice(0, digitIndex),
          candidate,
          ...new Array(batteryCount - digitIndex - 1).fill(-1),
        ]
        break
      }
    }
  }
  return Number(digits.join(''))
}

const totalJoltage = (batteryCount: number, lines: string[]) =>
  lines
    .filter((l) => l.length > 0)
    .reduce<number>((acc, line) => acc + joltage(batteryCount, line), 0)

test('example input part 1', () => {
  const lines = readInputFile('exampleInput.txt')
  expect(totalJoltage(2, lines)).toEqual(357)
})

test('example input part 2', () => {
  const lines = readInputFile('exampleInput.txt')
  expect(totalJoltage(12, lines)).toEqual(3121910778619)
})

test('joltage(2)', () => {
  expect(joltage(2, '12')).toEqual(12)
  expect(joltage(2, '12345')).toEqual(45)
  expect(joltage(2, '543212345')).toEqual(55)

  expect(joltage(2, '987654321111111')).toEqual(98)
  expect(joltage(2, '811111111111119')).toEqual(89)
  expect(joltage(2, '234234234234278')).toEqual(78)
  expect(joltage(2, '818181911112111')).toEqual(92)
})

test('joltage(3)', () => {
  expect(joltage(3, '12345')).toEqual(345)
  expect(joltage(3, '543212345')).toEqual(545)
})

test('joltage(12)', () => {
  expect(joltage(12, '987654321111111')).toEqual(987654321111)
  expect(joltage(12, '811111111111119')).toEqual(811111111119)
  expect(joltage(12, '234234234234278')).toEqual(434234234278)
  expect(joltage(12, '818181911112111')).toEqual(888911112111)
})

test('answers', () => {
  const lines = readInputFile('input.txt')
  console.log('03 pt1', totalJoltage(2, lines))
  console.log('03 pt2', totalJoltage(12, lines))
})
