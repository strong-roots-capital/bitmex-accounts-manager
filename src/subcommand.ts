import { docopt } from 'docopt'
import { Debug } from './debug'

const debug = {
    options: Debug(`bam:subcommand:raw-options`)
}

/* eslint-disable @typescript-eslint/no-explicit-any */

type Prepend<E, T extends any[]> = ((head: E, ...args: T) => any) extends (
    ...args: infer U
) => any
    ? U
    : T

type Length<T extends any[]> = T['length']

type Tail<T extends any[]> = ((...t: T) => any) extends (
    _: any,
    ...tail: infer TT
) => any
    ? TT
    : []

type Drop<N extends number, T extends any[], I extends any[] = []> = {
    0: Drop<N, Tail<T>, Prepend<any, I>>
    1: T
}[Length<I> extends N ? 1 : 0]

export interface Subcommand<I, F extends (options: I, ...args: any[]) => any> {
    docstring: string
    version: string
    parseArguments: (rawOptions: Record<string, any>) => I
    main: F
}

export function subcommand<I, F extends (options: I, ...args: any[]) => any>(
    command: Subcommand<I, F>
): (argv: string[], ...args: Drop<1, Parameters<F>>) => ReturnType<F> {
    return function executeSubcommand(
        argv: string[],
        ...args: Drop<1, Parameters<F>>
    ): ReturnType<F> {
        const rawOptions: Record<string, any> = docopt(command.docstring, {
            argv: argv,
            help: true,
            version: command.version,
            exit: true
        })

        debug.options(rawOptions)

        const options = command.parseArguments(rawOptions)
        return command.main(options, ...args)
    }
}

/* eslint-enable @typescript-eslint/no-explicit-any */

//  LocalWords:  bam subcommand
