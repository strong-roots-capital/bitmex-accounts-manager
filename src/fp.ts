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
