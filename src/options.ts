import { docopt } from 'docopt'
import { version } from './safe-version'
import { Debug } from './debug'
import { unsafeHead } from './fp'

const debug = {
    rawOptions: Debug(`bam:raw-options`),
    options: Debug('bam:options')
}

const commands = ['balance', 'position'] as const

type Command = typeof commands[number]

const docstring = `
BitMEX Accounts Manager

Usage:
    bam (${commands.join('|')}) [--account <account>...] [options]

Options:
    -a, --account       Filter results to specified accounts
`

export interface CommandLineOptions {
    command: 'balance' | 'position'
    accounts: string[]
}

function command(options: { [C in Command]: boolean }): Command {
    const entries = commands.reduce(
        // eslint-disable-next-line security/detect-object-injection
        (acc, command) => acc.concat([[command, options[command]]]),
        [] as [Command, boolean][]
    )
    return unsafeHead(
        entries
            .filter(([_command, value]) => value)
            .map(([command, _value]) => command)
    )
}

export function parseOptions(argv: string[]): CommandLineOptions {
    const rawOptions = docopt(docstring, {
        argv: argv,
        help: true,
        version: version,
        exit: true
    })

    const options: CommandLineOptions = {
        command: command(rawOptions),
        accounts: rawOptions['<account>']
    }

    debug.rawOptions(rawOptions)
    debug.options(options)

    return options
}

//  LocalWords:  bam
