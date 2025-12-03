import { test, expect } from 'vitest'
import { fileReader } from '../utils/fileReader'

const readInputFile = fileReader(__dirname)

const loadLines = (file: string) => readInputFile(file).split('\n')

const getRotation = (line: string) => {
  const direction = line[0]
  const rotation = Number(line.substring(1))
  const sign = direction === 'L' ? -1 : 1
  return sign * rotation
}

const countZeroes = (lines: string[]) => {
  let val = 50
  let zeroes = 0
  for (let line of lines) {
    const rotation = getRotation(line)
    val += rotation

    if (val % 100 === 0) {
      zeroes++
    }
  }
  return zeroes
}

const countZeroCrossings = (lines: string[]) => {
  let val = 50
  let crossings = 0
  for (let line of lines) {
    const rotation = getRotation(line)
    const next = val + rotation

    crossings += zeroCrossings(val, next)
    val = next
  }
  return crossings
}

const zeroCrossings = (val: number, next: number) => {
  let hundreds = Math.abs(Math.floor(val / 100) - Math.floor(next / 100))
  if (next > val) {
    return hundreds
  }
  const modifier = (val % 100 === 0 ? -1 : 0) + (next % 100 === 0 ? 1 : 0)
  return modifier + hundreds
}

test('isZeroCrossing', () => {
  expect(zeroCrossings(10, 0)).toEqual(1)
  expect(zeroCrossings(110, 0)).toEqual(2)
  expect(zeroCrossings(90, 100)).toEqual(1)
  expect(zeroCrossings(90, 110)).toEqual(1)
  expect(zeroCrossings(10, 1)).toEqual(0)
  expect(zeroCrossings(10, -10)).toEqual(1)
  expect(zeroCrossings(-10, 10)).toEqual(1)
  expect(zeroCrossings(-220, 10)).toEqual(3)
  expect(zeroCrossings(-90, -100)).toEqual(1)
  expect(zeroCrossings(-100, -199)).toEqual(0)
  expect(zeroCrossings(-100, -1)).toEqual(0)
  expect(zeroCrossings(-100, -1)).toEqual(0)
  expect(zeroCrossings(-110, -100)).toEqual(1)
  expect(zeroCrossings(-110, -99)).toEqual(1)
  expect(zeroCrossings(-99, -101)).toEqual(1)
  expect(zeroCrossings(99, 101)).toEqual(1)
})

test('parse lines', () => {
  expect(getRotation('L42')).toEqual(-42)
  expect(getRotation('R77')).toEqual(77)
})

test('part 1 with example input', () => {
  const lines = loadLines('exampleInput.txt')
  expect(countZeroes(lines)).toEqual(3)
})

test('part 2 with example input', () => {
  const lines = loadLines('exampleInput.txt')
  expect(countZeroes(lines)).toEqual(3)
})

test('answers', () => {
  const lines = loadLines('input.txt')
  console.log('01 pt1', countZeroes(lines))
  console.log('01 pt2', countZeroCrossings(lines))
})
