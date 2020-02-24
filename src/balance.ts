import zip from '@strong-roots-capital/zip'
import { FutureInstance, map, parallel } from 'fluture'
import { get } from 'shades'
import { fold, monoidSum } from 'fp-ts/lib/Monoid'
import { Effect } from './effect'
import { CommandLineOptions } from './options'
import { Accounts } from './accounts'
import { Debug } from './debug'
import { concurrentQueries } from './bitmex'
import * as query from './query'
import { tableConfig } from './table-config'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { table } = require('table')

const debug = {
    balance: Debug(`bam:balance`)
}

const sum = fold(monoidSum)

export function balance(
    _options: CommandLineOptions,
    accounts: Accounts
): FutureInstance<unknown, Effect> {
    debug.balance(`Executing command 'balance'`)

    const queries = Object.entries(accounts).map(([name, account]) =>
        query.wallet(name, account)
    )

    return parallel (concurrentQueries()) (queries)
        .pipe (map (wallets => wallets.map(get('amount'))))
        .pipe (map (balances => [...balances, sum(balances)]))
        .pipe (map (zip([...Object.keys(accounts), 'Total'])))
        .pipe (map (data => data.length > 1 ? table(data, tableConfig) : ''))
        .pipe (map (table => () => console.log(table)))
}
