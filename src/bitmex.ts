import { seconds } from './time'

type PerMinute = number;

const rateLimit: PerMinute = 60
const averageRoundTripTime = seconds(3)

export function concurrentQueries(): number {
    const safetyBuffer = 2 / 3
    return Math.floor(
        rateLimit /
            rateLimit / averageRoundTripTime
            * safetyBuffer
    )
}
