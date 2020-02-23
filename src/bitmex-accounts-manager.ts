/**
 * bitmex-accounts-manager
 * Manage multiple BitMEX exchange accounts
 */

import { FutureInstance } from 'fluture'
import { parseAccounts } from './accounts'
import { balance } from './balance'
import { parseOptions } from './options'
import { Effect } from './effect'

// TODO: discuss commands
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

    const options = parseOptions(argv)
    const accounts = parseAccounts()

    switch (options.command) {
        case 'balance':
            return balance(options, accounts)
    }
}

//  LocalWords:  bam
