import * as Future from 'fluture'
import { FutureInstance } from 'fluture'
import { Effect } from './effect'
import { CommandLineOptions } from './options'
import { Accounts } from './accounts'

export function balance(
    _options: CommandLineOptions,
    _accounts: Accounts
): FutureInstance<string, Effect> {


    return Future.resolve(() => console.table([{a: 1, b: 'y'}, {a: 'Z', b: 2}]))
}
