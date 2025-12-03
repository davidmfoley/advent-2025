import path from 'path'
import fs from 'fs'
export const fileReader = (dirName: string) => (fileName: string) =>
  fs.readFileSync(path.join(dirName, fileName), 'utf-8')
