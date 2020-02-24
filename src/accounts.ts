import * as t from 'io-ts'
import { secrets } from '@strong-roots-capital/docker-secrets'
import { trace, safeParseJson, id } from './fp'
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
export type Account = t.TypeOf<typeof AccountShape>;

const NameShape = t.string;
export type Name = t.TypeOf<typeof NameShape>;

const AccountsShape = t.record(t.string, AccountShape)
export type Accounts = t.TypeOf<typeof AccountsShape>;

export function parseAccounts(): Accounts {

    const secret = 'accounts'

    const secretValue = secrets.getSync(secret)
        .toEither(`${secret} environment variable not defined`)
        .chain(safeParseJson)
        .mapLeft(trace(debug.env))
        .orDefault(Object.create(null))

    return pipe(
        right(secretValue),
        chain(AccountsShape.decode),
        bimap(
            (error) => {
                console.error(`Error: unable to parse accounts from ${JSON.stringify(secretValue)}`)
                return error
            },
            trace(debug.env, `Using accounts`)
        ),
        fold(() => Object.create(null), id)
    )
}

//  LocalWords:  apiKeyId apiKeySecret bam secretValue
