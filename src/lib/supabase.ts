import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jpomqizpyvljgcjufwkm.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impwb21xaXpweXZsamdjanVmd2ttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2ODEwNDAsImV4cCI6MjA5MTI1NzA0MH0.gMHxqPZRQ2yCNj_ggknXl-S-TvPUTBMPNp1IX8Dl_I0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export async function dbGet(key: string): Promise<unknown> {
  const { data, error } = await supabase
    .from('sync_data')
    .select('value')
    .eq('key', key)
    .maybeSingle()
  if (error) throw error
  return data?.value ?? null
}

export async function dbSet(key: string, value: unknown): Promise<void> {
  const { error } = await supabase
    .from('sync_data')
    .upsert({ key, value, updated_at: new Date().toISOString() })
  if (error) throw error
}
