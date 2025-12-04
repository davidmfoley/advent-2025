import { expect, test } from 'vitest'
import { fileReader } from '../utils/fileReader'

type Location = [number, number]
class LocationMap extends Map<string, Location> {}

const buildLocationMap = (input: string) => {
  let map = new LocationMap()

  const grid = input.split('\n').map((l) => l.split(''))

  grid.forEach((line, y) => {
    line.forEach((cell, x) => {
      if (cell === '@') map.set(locationKey([x, y]), [x, y])
    })
  })

  return map
}

const readInputFile = fileReader(__dirname, buildLocationMap)

const locationKey = ([x, y]: Location) => `${x},${y}`

const eightDirections = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

const neighborCount = ([x, y]: Location, map: LocationMap) =>
  eightDirections
    .map(([dx, dy]) => [x + dx, y + dy])
    .map(locationKey)
    .filter((k) => map.has(k)).length

const reachableLocations = (map: LocationMap) =>
  [...map.values()].filter((coords) => neighborCount(coords, map) < 4)

const part1 = (map: LocationMap) => reachableLocations(map).length

const part2 = (map: LocationMap) => {
  const startingCount = map.size

  while (map.size) {
    const reachable = reachableLocations(map)
    if (reachable.length === 0) return startingCount - map.size

    for (let location of reachable) {
      map.delete(locationKey(location))
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
