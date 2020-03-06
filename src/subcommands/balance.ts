// eslint-disable-next-line @typescript-eslint/no-var-requires
const { table } = require('table')

import zip from '@strong-roots-capital/zip'
import { FutureInstance, map, parallel } from 'fluture'
import { get } from 'shades'
import { fold, monoidSum } from 'fp-ts/lib/Monoid'
import { version } from '../safe-version'
import { Effect } from '../effect'
import { CommandLineOptions } from '../options'
import { Debug } from '../debug'
import { concurrentQueries } from '../bitmex'
import { isEmpty } from '../fp'
import * as query from '../query'
import { subcommand } from '../subcommand'
import { tableConfig } from '../table-config'
import {
    Accounts,
    accountName,
    isIncludedAccount,
    includedAccounts
} from '../accounts'

const debug = {
    options: Debug(`bam:balance:options`),
    balance: Debug(`bam:balance`)
}

const sum = fold(monoidSum)

interface BalanceOptions extends CommandLineOptions {
    includeUnrealizedPnL: boolean
    accounts: string[]
}

const docstring = `
Balances

Usage:
    bam (balance) [-u] [--account <account>...]

Options:
    -a, --account       Filter results to specified accounts
    -u, --unrealized    Include unrealized PnL in output
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseArguments(rawOptions: Record<string, any>): BalanceOptions {
    return {
        command: 'balance',
        includeUnrealizedPnL: rawOptions['--unrealized'],
        accounts: rawOptions['<account>']
    }
}

function main(
    options: BalanceOptions,
    accounts: Accounts
): FutureInstance<unknown, Effect> {
    debug.balance(`Executing command 'balance'`)

    const queries = Object.entries(accounts)
        .filter(isIncludedAccount(options.accounts))
        .map(([name, account]) =>
            options.includeUnrealizedPnL
                ? query.margin(name, account).pipe(map(get('marginBalance')))
                : query.wallet(name, account).pipe(map(get('amount')))
        )

    const isSummableBalance =
        isEmpty(options.accounts) || options.accounts.length > 1

    const tableBalances = (balances: number[]) =>
        isSummableBalance ? balances.concat(sum(balances)) : balances

    const tableAccountNames = isSummableBalance
        ? includedAccounts(accounts, options.accounts)
              .map(accountName)
              .concat('Total')
        : includedAccounts(accounts, options.accounts).map(accountName)

    return parallel(concurrentQueries())(queries)
        .pipe(map(tableBalances))
        .pipe(map(zip(tableAccountNames)))
        .pipe(map(data => table(data, tableConfig)))
        .pipe(map(table => () => console.log(table)))
}

export const balance = subcommand({
    docstring,
    version,
    parseArguments,
    main
})

//  LocalWords:  bam PnL marginBalance
