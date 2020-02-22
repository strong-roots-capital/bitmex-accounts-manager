import { Codec } from 'purify-ts/Codec'
import { Either, Right, Left } from 'purify-ts/Either'
import { secrets } from '@strong-roots-capital/docker-secrets'
import { trace, safeParseJson, id } from './fp'
import { has, isObject } from './parse'
import { Debug } from './debug'

const debug = {
    env: Debug(`bam:env`)
}

export interface Account {
    apiKeyId: string;
    apiKeySecret: string;
}

export type Name = string;
export type Accounts = Record<Name, Account>;

function isAccount(value: unknown): value is Account {
    return isObject(value)
        && has('apiKeyId', value)
        && has('apiKeySecret', value)
}

function parseAccountRecord(value: unknown): Either<string, Accounts> {
    if (!isObject(value)) {
        return Left(`Expected Object, received '${value}'`)
    }

    const accounts: Accounts = Object.create(null)

    for (const [k, v] of Object.entries(value)) {
        if (!isAccount(v)) {
            return Left(
                [
                    `Expected Account, received`,
                    JSON.stringify({[k]: v})
                ].join(' ')
            )
        }

        accounts[k] = v
    }

    return Right(accounts)
}

const Accounts = Codec.custom<Accounts>({
    decode: input => parseAccountRecord(input),
    encode: id
})

export function parseAccounts(): Accounts {

    const secret = 'accounts'

    return secrets.getSync(secret)
        .toEither(secret.toUpperCase().concat(` environment variable not defined`))
        .chain(safeParseJson)
        .chain(Accounts.decode)
        .mapLeft(trace(debug.env))
        .chainLeft(() => Right(Object.create(null)))
        .map(trace(debug.env, `Using accounts`))
        .extract()
}

//  LocalWords:  apiKeyId apiKeySecret bam
