import test from 'ava'

/**
 * Unit under test
 */

import { seconds } from '../../src/time'

test('should multiply input value by one-thousand', t => {
    const input = 3
    t.is(input * 1000, seconds(input))
})
