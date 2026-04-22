import { createClient } from '@supabase/supabase-js'

// createClient crea la conexión a tu base de datos Supabase.
// Es como abrir una sesión con el servidor — la reutilizas en toda la app.
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)