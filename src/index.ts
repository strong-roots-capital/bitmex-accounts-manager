#!/usr/bin/env node

import { fork } from 'fluture'
import { bitmexAccountsManager } from './bitmex-accounts-manager'

function main(): void {
    fork (console.error.bind(null))
    (() => {return void 0})
    (bitmexAccountsManager(process.argv.slice(2)))
}

main()

// Local Variables:
// mode: typescript
// End:
