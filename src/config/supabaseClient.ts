type Supabase = {
    supabaseUrl: string,
    supabaseKey: string
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or key not provided");
}

const supabase = createClient<Supabase>(
    supabaseUrl,
    supabaseKey
)
export default supabase
