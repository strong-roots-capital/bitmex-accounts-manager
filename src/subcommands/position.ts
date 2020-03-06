// eslint-disable-next-line @typescript-eslint/no-var-requires
const { table } = require('table')

import { Table, tableConfig } from '../table-config'
import { percentageChange } from 'percentage-change'
import { BITMEX } from 'bitmex-node'
import { selectValues, isEmpty } from '../fp'
import { FutureInstance, map, parallel } from 'fluture'
import { Debug } from '../debug'
import { subcommand } from '../subcommand'
import { concurrentQueries } from '../bitmex'
import * as query from '../query'
import { CommandLineOptions } from '../options'
import { Effect } from '../effect'
import { version } from '../safe-version'
import { Name, Accounts, isIncludedAccount } from '../accounts'

const debug = {
    options: Debug(`bam:position:options`),
    command: Debug(`bam:position`)
}

const docstring = `
Positions

Usage:
    bam (position) [--account <account>...]

Options:
    -a, --account       Filter results to specified accounts
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseArguments(rawOptions: Record<string, any>): CommandLineOptions {
    return {
        command: 'position',
        accounts: rawOptions['<account>']
    }
}

function main(
    options: CommandLineOptions,
    accounts: Accounts
): FutureInstance<unknown, Effect> {
    debug.command(`Executing command 'position'`)

    const queries: FutureInstance<
        unknown,
        [string, BITMEX.Position[]]
    >[] = Object.entries(accounts)
        .filter(isIncludedAccount(options.accounts))
        .map(([name, account]) =>
            query
                .position(name, account)
                .pipe(map(position => [name, position]))
        )

    /**
     * DISCUSS: adding long/short for easy grepping
     */

    const tableColumnNames = [
        'Account',
        'Symbol',
        'Quantity',
        'Entry Price',
        'Mark Price',
        'Change',
        'Liquidation',
        'Leverage',
        'Cross',
        'Opened'
    ]

    const addTableColumnNames = (table: Table): Table => {
        table.unshift(tableColumnNames)
        return table
    }

    const addPercentageChange = (
        row: (string | number | boolean)[]
    ): (string | number | boolean)[] => {
        const entry = row[3] as number
        const mark = row[4] as number
        row.splice(
            5,
            0,
            percentageChange(entry, mark)
                .map(n => n.toFixed(2))
                .map(n => `${n}%`)
                .orDefault('n/a')
        )
        return row
    }

    return parallel(concurrentQueries())(queries)
        .pipe(
            map(accountPositions =>
                accountPositions.filter(([_name, position]) => {
                    return !isEmpty(position)
                })
            )
        )
        .pipe(
            map(
                accountPositions =>
                    accountPositions.flatMap(([name, positions]) =>
                        positions.map(position => [name, position])
                    ) as [string, BITMEX.Position][]
            )
        )
        .pipe(
            map(accountPositions =>
                accountPositions.map(
                    ([name, position]) =>
                        [
                            name,
                            ...selectValues(
                                [
                                    'symbol',
                                    'currentQty',
                                    'avgEntryPrice',
                                    'markPrice',
                                    'liquidationPrice',
                                    'leverage',
                                    'crossMargin',
                                    'openingTimestamp'
                                ],
                                position
                            )
                        ] as [
                            Name,
                            string,
                            number,
                            number,
                            number,
                            number,
                            number,
                            boolean,
                            string
                        ]
                )
            )
        )
        .pipe(map(rows => rows.map(addPercentageChange)))
        .pipe(map(addTableColumnNames))
        .pipe(map(data => table(data, tableConfig)))
        .pipe(map(table => () => console.log(table)))
}

export const position = subcommand({
    docstring,
    version,
    parseArguments,
    main
})

//  LocalWords:  bam currentQty avgEntryPrice markPrice crossMargin
//  LocalWords:  liquidationPrice openingTimestamp
