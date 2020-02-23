export type Milliseconds = number;

export function seconds(value: number): Milliseconds {
    return value * 1000
}
