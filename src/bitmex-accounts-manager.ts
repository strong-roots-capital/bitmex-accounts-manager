/**
 * bitmex-accounts-manager
 * Manage multiple BitMEX exchange accounts
 */

import { FutureInstance } from 'fluture'
import { parseAccounts } from './accounts'
import { parseOptions } from './options'
import { Effect } from './effect'
import { Maybe } from 'purify-ts'
import { balance } from './subcommands/balance'
import { position } from './subcommands/position'

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
    const command = Maybe.fromNullable(argv[0])
        .map(command => [command])
        .orDefault([''])

    const options = parseOptions(command)
    const accounts = parseAccounts()

    switch (options.command) {
        case 'balance':
            return balance(argv, accounts)
        case 'position':
            return position(argv, accounts)
        default:
            throw new Error(`No defined sub-command ${options.command}`)
    }
}

//  LocalWords:  bam
