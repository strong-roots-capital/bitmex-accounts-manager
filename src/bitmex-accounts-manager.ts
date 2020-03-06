/**
 * bitmex-accounts-manager
 * Manage multiple BitMEX exchange accounts
 */

import { FutureInstance } from 'fluture'
import { parseAccounts } from './accounts'
import { balance } from './balance'
import { parseOptions } from './options'
import { Effect } from './effect'
import { Maybe } from 'purify-ts'

// TODO: discuss commands
// - positions
// - risk
// - cancel
// - close
// - profits
// - funding (expected)
// - affiliate
// - commission
// - withdrawal
// PnL history

export function bitmexAccountsManager(
    argv: string[]
): FutureInstance<unknown, Effect> {
    console.log('Am here with argv', argv)

    const command = Maybe.fromNullable(argv[0])
        .map(command => [command])
        .orDefault([''])

    const options = parseOptions(command)
    const accounts = parseAccounts()

    switch (options.command) {
        case 'balance':
            return balance(argv, accounts)
    }
}

//  LocalWords:  bam
