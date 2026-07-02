'use server'

import { cookies } from 'next/headers'

export async function loginAction(email: string) {
  const cookieStore = await cookies()
  cookieStore.set('admin_auth', email, { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' })
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_auth')
}
