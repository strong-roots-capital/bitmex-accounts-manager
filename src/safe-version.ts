import * as fs from 'fs'
import * as path from 'path'

function isVersionPresent(): boolean {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    return fs.existsSync(path.join(__dirname, 'version.ts'))
}

export const version: string = isVersionPresent()
    ? require('./version').version
    : '0.0.0'

//  LocalWords:  fs
