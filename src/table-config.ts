// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getBorderCharacters } = require('table')

export const tableConfig = {
    border: getBorderCharacters('void'),
    drawHorizontalLine: () => false
}
