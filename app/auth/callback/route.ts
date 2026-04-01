import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Auth callback handler for email confirmation and OAuth redirects.
 * Exchanges the auth code for a session and redirects to the appropriate page.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Successfully exchanged code for session
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to login with error if code exchange failed
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
