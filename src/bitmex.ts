import { seconds } from './time'

type PerMinute = number

const rateLimit: PerMinute = 60
const averageRoundTripTime = seconds(3)

export function concurrentQueries(): number {
    const safetyBuffer = 2 / 3
    const queryGroups = rateLimit / averageRoundTripTime
    const queriesPerQueryGroup = rateLimit / queryGroups
    return Math.floor(queriesPerQueryGroup * safetyBuffer)
}
