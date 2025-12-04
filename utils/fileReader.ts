import path from 'path'
import fs from 'fs'

type Parser<T> = (s: string) => T
const defaultParser: Parser<string> = (s) => s

export const nonBlankLines = (s: string) => s.split('\n').filter(Boolean)

export const fileReader =
  <T = string>(dirName: string, parser?: Parser<T>) =>
  (fileName: string) =>
    ((parser ?? defaultParser) as Parser<T>)(
      fs.readFileSync(path.join(dirName, fileName), 'utf-8')
    )
