'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export interface AuthResult {
  error?: string
  success?: boolean
}

/**
 * Sign in with email and password
 */
export async function signIn(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Sign up with email and password
 */
export async function signUp(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  // Get the redirect URL - use environment variable or construct from origin
  const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || 
    `${process.env.NEXT_PUBLIC_SITE_URL || ''}/auth/callback`

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: fullName || null,
        role: 'user',
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

/**
 * Get the current user's profile from the database
 */
export async function getCurrentProfile() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return null
  }
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (profileError) {
    return null
  }
  
  return profile
}

/**
 * Update the current user's password
 */
export async function updatePassword(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()
  
  const newPassword = formData.get('newPassword') as string
  
  if (!newPassword || newPassword.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  
  if (error) {
    return { error: error.message }
  }
  
  return { success: true }
}

/**
 * Request password reset email
 */
export async function requestPasswordReset(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  
  if (!email) {
    return { error: 'Email is required' }
  }
  
  const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || 
    `${process.env.NEXT_PUBLIC_SITE_URL || ''}/auth/reset-password`
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  })
  
  if (error) {
    return { error: error.message }
  }
  
  return { success: true }
}
