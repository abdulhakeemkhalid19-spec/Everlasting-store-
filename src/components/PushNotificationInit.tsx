'use client'
import { useEffect } from 'react'
import { app, getMessaging, getToken } from '@/lib/firebase'
import { supabase } from '@/lib/supabase'

export default function PushNotificationInit() {
  useEffect(() => {
    initPush()
  }, [])

  const initPush = async () => {
    try {
      if (!('Notification' in window)) return
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return

      const messaging = getMessaging(app)
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      })

      if (token) {
        await supabase.from('push_tokens').upsert({ token }, { onConflict: 'token' })
      }
    } catch (err) {
      console.error('Push init error:', err)
    }
  }

  return null
}
