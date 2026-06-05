import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Category = {
  id: string
  name: string
  slug: string
  created_at: string
}

export type Product = {
  id: string
  name: string
  description: string
  price: number
  compare_price: number
  image_url: string
  category_id: string
  stock_quantity: number
  is_active: boolean
  created_at: string
}
