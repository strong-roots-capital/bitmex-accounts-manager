export function has<K extends string>(
    key: K,
    x: object
): x is { [key in K]: unknown } {
    return key in x
}

export function isObject(value: unknown): value is object {
    return Object.prototype.toString.call(value) === '[object Object]'
}
