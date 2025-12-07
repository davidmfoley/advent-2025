import { expect, test } from 'vitest'
import { fileReader, nonBlankLines } from '../utils/fileReader'

const splitterInput = (s: string) => {
  const lines = nonBlankLines(s)
  const startColumn = lines.shift().indexOf('S')

  const grid = lines.map((line) => line.split(''))

  const splitters = grid.map((row) =>
    row
      .map((c, column) => (c === '^' ? column : null))
      .filter((c) => typeof c === 'number')
  )

  return { startColumn, splitters, width: lines[0].length }
}

type SplitterInput = ReturnType<typeof splitterInput>

const readSplitterInput = fileReader(__dirname, splitterInput)

class BeamSet {
  // column => timeline count
  private activeBeams: number[]
  public splitCount: number

  constructor(width: number, startColumn: number) {
    this.activeBeams = new Array(width).fill(0)
    this.activeBeams[startColumn] = 1

    this.splitCount = 0
  }

  split(column: number) {
    const count = this.activeBeams[column]
    if (!count) return

    this.splitCount++

    this.activeBeams[column] = 0
    this.activeBeams[column - 1] += count
    this.activeBeams[column + 1] += count
  }

  get timelineCount() {
    return this.activeBeams.reduce((a, b) => a + b, 0)
  }
}

const solve = (input: SplitterInput) => {
  const beams = new BeamSet(input.width, input.startColumn)

  for (let splitterRow of input.splitters) {
    for (let splitterColumn of splitterRow) {
      beams.split(splitterColumn)
    }
  }

  return beams
}

test('parse example input', () => {
  const input = readSplitterInput('exampleInput.txt')
  expect(input.startColumn).toEqual(7)
  expect(input.splitters[1]).toEqual([7])
})

test('part1 example input', () => {
  const input = readSplitterInput('exampleInput.txt')
  expect(solve(input).splitCount).toEqual(21)
})

test('part2 example input', () => {
  const input = readSplitterInput('exampleInput.txt')
  expect(solve(input).timelineCount).toEqual(40)
})

test('answers', () => {
  const input = readSplitterInput('input.txt')
  const solution = solve(input)
  console.log('07 pt 1', solution.splitCount)
  console.log('07 pt 2', solution.timelineCount)
})
