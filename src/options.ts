import { docopt } from 'docopt'
import { version } from './safe-version'
import { Debug } from './debug'

const debug = {
    options: Debug('bam:options')
}

const docstring = `
BitMEX Accounts Manager

Usage:
    bam (balance) [--combined]

Options:
    -c --combined    Aggregate data from all accounts
`

export interface CommandLineOptions {
    command: 'balance';
    combined: boolean;
}

export function parseOptions(argv: string[]): CommandLineOptions {

    const rawOptions = docopt(
        docstring,
        {
            argv: argv,
            help: true,
            version: version,
            exit: true
        }
    )

    const options: CommandLineOptions = {
        command: rawOptions.balance ? 'balance' : 'balance',
        combined: rawOptions['--combined']
    }

    debug.options(rawOptions)
    debug.options(options)

    return options
}

//  LocalWords:  bam
