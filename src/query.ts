import * as Future from 'fluture'
import { FutureInstance } from 'fluture'
import { BITMEX, BitmexAPI } from 'bitmex-node'
import { Debug } from './debug'
import { Account } from './accounts'

const debug = {
    query: Debug(`bam:query`)
}

export function wallet(
    name: string,
    account: Account
): FutureInstance<unknown, BITMEX.Wallet> {

    return Future.attemptP(
        async function queryBitmexWallet() {
            debug.query(`Querying wallet for account ${name}`)
            return (new BitmexAPI({
                apiKeyID: account.apiKeyId,
                apiKeySecret: account.apiKeySecret
            }))
                .User.getWallet()
        }
    )
}
