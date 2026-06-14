import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { title, body, password } = await req.json()

  if (password !== 'everlasting2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: tokens } = await supabase.from('push_tokens').select('token')
  if (!tokens || tokens.length === 0) {
    return NextResponse.json({ error: 'No subscribers' }, { status: 400 })
  }

  const accessToken = await getAccessToken()

  const results = await Promise.allSettled(
    tokens.map((t) =>
      fetch(`https://fcm.googleapis.com/v1/projects/everlasting-store/messages:send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          message: {
            token: t.token,
            notification: { title, body },
            webpush: {
              notification: {
                title,
                body,
                icon: '/icon-192.png',
              },
            },
          },
        }),
      })
    )
  )

  return NextResponse.json({ sent: results.length })
}

async function getAccessToken() {
  const key = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)
  const { GoogleAuth } = await import('google-auth-library')
  const auth = new GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
  })
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  return token.token
}
