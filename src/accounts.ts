import * as t from 'io-ts'
import { secrets } from '@strong-roots-capital/docker-secrets'
import { trace, safeParseJson, id } from './fp'
import { isEmpty } from './fp'
import { Debug } from './debug'
import { pipe } from 'fp-ts/lib/pipeable'
import { right, bimap, chain, fold } from 'fp-ts/lib/Either'

const debug = {
    env: Debug(`bam:env`)
}

const AccountShape = t.type({
    apiKeyId: t.string,
    apiKeySecret: t.string
})
export type Account = t.TypeOf<typeof AccountShape>

const NameShape = t.string
export type Name = t.TypeOf<typeof NameShape>

const AccountsShape = t.record(t.string, AccountShape)
export type Accounts = t.TypeOf<typeof AccountsShape>

export type NamedAccount = [string, Account]

export function parseAccounts(): Accounts {
    const secret = 'accounts'

    const secretValue = secrets
        .getSync(secret)
        .toEither(`${secret} environment variable not defined`)
        .chain(safeParseJson)
        .mapLeft(trace(console.error, `Error parsing accounts:`))
        .orDefaultLazy(process.exit.bind(null))

    return pipe(
        right(secretValue),
        chain(AccountsShape.decode.bind(null)),
        bimap(error => {
            console.error(
                `Error: unable to parse accounts from`,
                JSON.stringify(secretValue)
            )
            return error
        }, trace(debug.env, `Using accounts`)),
        fold(() => Object.create(null), id)
    )
}

export function accountName([name, _account]: NamedAccount): Name {
    return name
}

export function isIncludedAccount(
    included: string[]
): ([name, account]: NamedAccount) => boolean {
    return function isAccountIncluded([name, _account]) {
        return isEmpty(included) || included.includes(name)
    }
}

function namedAccounts(accounts: Accounts): NamedAccount[] {
    return Object.entries(accounts)
}

export function includedAccounts(
    accounts: Accounts,
    selected: Name[]
): NamedAccount[] {
    return namedAccounts(accounts).filter(isIncludedAccount(selected))
}

//  LocalWords:  bam secretValue
