import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bryratbiqruhyriibhxe.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyeXJhdGJpcXJ1aHlyaWliaHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTUxMzIsImV4cCI6MjA2NzgzMTEzMn0.9n_F8hUhfPV-p14afemGb9sx-lM_Yv008mGMR2l1dh0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

export default supabase;