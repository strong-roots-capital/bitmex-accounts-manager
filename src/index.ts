#!/usr/bin/env node

import { fork } from 'fluture'
import { bitmexAccountsManager } from './bitmex-accounts-manager'

function main(): void {
    bitmexAccountsManager(process.argv.slice(2))
        .pipe(
            fork
            (console.error.bind(null))
            (effect => effect())
        )
}

main()

// Local Variables:
// mode: typescript
// End:
