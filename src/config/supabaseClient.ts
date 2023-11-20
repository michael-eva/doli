import { createClient } from '@supabase/supabase-js'

type Supabase = {
    supabaseUrl: string,
    supabaseKey: string
}

const supabaseUrl = 'https://yagpsuctumdlmcazzeuv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhZ3BzdWN0dW1kbG1jYXp6ZXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAzNjk3MzQsImV4cCI6MjAxNTk0NTczNH0.Ei-PkGPil_G1eRRyuNU4DWy2crAAm61qSE-IXVGFJUw'
const supabase = createClient<Supabase>(
    supabaseUrl,
    supabaseKey
)
export default supabase