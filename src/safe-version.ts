import * as fs from 'fs'
import * as path from 'path'

function isVersionPresent(): boolean {
    return fs.existsSync(path.join(__dirname, 'version.ts'))
}

export const version: string = isVersionPresent()
    ? require('./version').version
    : '0.0.0'
