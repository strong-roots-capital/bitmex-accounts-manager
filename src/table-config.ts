// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getBorderCharacters } = require('table')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Table<> = any[][]

export const tableConfig = {
    border: getBorderCharacters('void'),
    drawHorizontalLine: () => false
}
