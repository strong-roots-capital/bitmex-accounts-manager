import { docopt } from 'docopt'
import { version } from './safe-version'
import { Debug } from './debug'

const debug = {
    rawOptions: Debug(`bam:raw-options`),
    options: Debug('bam:options')
}

const docstring = `
BitMEX Accounts Manager

Usage:
    bam (balance) [--account <account>...] [options]

Options:
    -a, --account       Filter results to specified accounts
`

export interface CommandLineOptions {
    command: 'balance'
    accounts: string[]
}

export function parseOptions(argv: string[]): CommandLineOptions {
    const rawOptions = docopt(docstring, {
        argv: argv,
        help: true,
        version: version,
        exit: true
    })

    const options: CommandLineOptions = {
        command: rawOptions.balance ? 'balance' : 'balance',
        accounts: rawOptions['<account>']
    }

    debug.rawOptions(rawOptions)
    debug.options(options)

    return options
}

//  LocalWords:  bam
