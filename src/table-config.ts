const { getBorderCharacters } = require('table')

export const tableConfig = {
    border: getBorderCharacters('void'),
    drawHorizontalLine: () => false
}
