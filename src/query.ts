import * as Future from 'fluture'
import { FutureInstance } from 'fluture'
import { BITMEX, BitmexAPI } from 'bitmex-node'
import { Debug } from './debug'
import { Account } from './accounts'

const debug = {
    query: Debug(`bam:query`)
}

function client(account: Account): BitmexAPI {
    return new BitmexAPI({
        apiKeyID: account.apiKeyId,
        apiKeySecret: account.apiKeySecret
    })
}

export function wallet(
    name: string,
    account: Account
): FutureInstance<unknown, BITMEX.Wallet> {
    return Future.attemptP(async function queryBitmexWallet() {
        debug.query(`Querying wallet for account ${name}`)
        return client(account).User.getWallet()
    })
}

export function margin(
    name: string,
    account: Account
): FutureInstance<unknown, BITMEX.Margin> {
    return Future.attemptP(async function queryBitmexMargin() {
        debug.query(`Querying margin for account ${name}`)
        return client(account).User.getMargin()
    })
}
