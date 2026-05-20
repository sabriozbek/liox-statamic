export function getRoutePayload<T = unknown>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null
  }

  const payloads = window.__LIOX_ROUTE_DATA__ as Record<string, unknown> | undefined

  if (!payloads || !(key in payloads)) {
    return null
  }

  return (payloads[key] as T) ?? null
}
