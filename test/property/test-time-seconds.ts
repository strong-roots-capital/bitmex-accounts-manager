import { testProp, fc } from 'ava-fast-check'

/**
 * Library under test
 */

import { seconds } from '../../src/time'

testProp('should multiply input by one-thousand', [fc.float()], input => {
    if (Number.isNaN(input)) {
        return true
    }
    return input * 1000 === seconds(input)
})
