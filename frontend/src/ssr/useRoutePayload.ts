let serverRoutePayloads: Record<string, unknown> = {}

export function setServerRoutePayloads(payloads: Record<string, unknown>) {
  serverRoutePayloads = payloads
}

export function resetServerRoutePayloads() {
  serverRoutePayloads = {}
}

export function getRoutePayload<T = unknown>(key: string): T | null {
  if (typeof window === 'undefined') {
    return (serverRoutePayloads[key] as T) ?? null
  }

  const payloads = window.__LIOX_ROUTE_DATA__ as Record<string, unknown> | undefined

  if (!payloads || !(key in payloads)) {
    return null
  }

  return (payloads[key] as T) ?? null
}
