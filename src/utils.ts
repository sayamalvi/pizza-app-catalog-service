export function mapToObject(
    map: Map<unknown, unknown>,
): Record<string, unknown> {
    const obj: Record<string, unknown> = {};
    for (const [key, value] of map) {
        if (typeof key !== 'string') {
            throw new TypeError(
                `Invalid key type: ${typeof key}. Expected a string.`,
            );
        }
        obj[key] = value instanceof Map ? mapToObject(value) : value;
    }
    return obj;
}
