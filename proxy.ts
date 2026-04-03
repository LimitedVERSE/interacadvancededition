import { updateSession } from '@/lib/supabase/proxy'
import type { NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Only match page navigations — skip _next internals, static assets,
     * and the /_next/server-actions fetch that the server-action POST uses.
     * This prevents the proxy from intercepting server action calls.
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)',
  ],
}
