import { expect, test } from 'vitest'
import { fileReader } from '../utils/fileReader'

type LocationMap = Map<string, Location>
type Location = [number, number]

const grid = (s: string) => s.split('\n').map((l) => l.split(''))

const readInputFile = fileReader(__dirname, grid)

const locationKey = ([x, y]: Location) => `${x},${y}`

const getOccupiedLocations = (grid: string[][]) => {
  let result = new Map<string, Location>()
  grid.forEach((line, y) => {
    line.forEach((cell, x) => {
      if (cell === '@') result.set(locationKey([x, y]), [x, y])
    })
  })
  return result
}

const dirs = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

const getNeighborCount = ([x, y]: Location, occupiedLocations: LocationMap) => {
  const neighborLocations = dirs.map(([dx, dy]) => [x + dx, y + dy])

  return neighborLocations
    .map(locationKey)
    .filter((k) => occupiedLocations.has(k)).length
}

const part1 = (cells: string[][]) => {
  const occupiedLocations = getOccupiedLocations(cells)
  const reachable = [...occupiedLocations.entries()].filter(
    ([, coords]) => getNeighborCount(coords, occupiedLocations) < 4
  )

  return reachable.length
}

const part2 = (cells: string[][]) => {
  const occupiedLocations = getOccupiedLocations(cells)
  const startingCount = occupiedLocations.size

  while (occupiedLocations.size) {
    const reachable = [...occupiedLocations.entries()].filter(
      ([, coords]) => getNeighborCount(coords, occupiedLocations) < 4
    )
    if (reachable.length === 0) return startingCount - occupiedLocations.size

    for (let [k] of reachable) {
      occupiedLocations.delete(k)
    }
  }

  return startingCount
}

test('04 part 1 example input', () => {
  const exampleInput = readInputFile('exampleInput.txt')
  expect(part1(exampleInput)).toEqual(13)
})

test('04 part 2 example input', () => {
  const exampleInput = readInputFile('exampleInput.txt')
  expect(part2(exampleInput)).toEqual(43)
})

test('04 answers', () => {
  const grid = readInputFile('input.txt')
  console.log('04 pt1', part1(grid))
  console.log('04 pt2', part2(grid))
})
