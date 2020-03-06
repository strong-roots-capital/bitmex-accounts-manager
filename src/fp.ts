import { Debugger } from 'debug'
import { NonEmptyList } from 'purify-ts/NonEmptyList'
import { Left, Right, Either } from 'purify-ts/Either'

export function id<T>(value: T): T {
    return value
}

export function tryCatch<R>(f: () => R): Either<string, R> {
    try {
        return Right(f())
    } catch (error) {
        return Left(error.message)
    }
}

export function safeParseJson(json: unknown): Either<string, unknown> {
    return typeof json !== 'string'
        ? Left(`Cannot parse JSON from non-string value`)
        : tryCatch(() => JSON.parse(json))
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function trace(
    logger: Debugger | typeof console.log,
    ...tag: any[]
): <T>(value: T) => T {
    return function trace<T>(value: T): T {
        if (NonEmptyList.isNonEmpty(tag)) {
            const head = tag.shift()
            logger(head, ...tag, value)
            tag.unshift(head)
        } else {
            logger(value)
        }
        return value
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function isEmpty<T>(list: T[]): boolean {
    return list.length === 0
}

export function unsafeHead<T>(list: T[]): T {
    return list[0]
}

export function selectValues<T extends object, K extends Partial<keyof T>>(
    keys: K[],
    value: T
    // TODO: stronger return-type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
    const selected = Object.entries(value).reduce(
        (acc, [key, value]) =>
            keys.includes(key as K)
                ? Object.assign(acc, { [key]: value })
                : acc,
        Object.create(null)
    )

    return keys.reduce(
        // eslint-disable-next-line security/detect-object-injection
        (acc, key) => acc.concat(selected[key]),
        []
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function not<F extends (...args: any[]) => any>(f: F): F {
    return function negated(...args) {
        return !f(...args)
    } as F
}
