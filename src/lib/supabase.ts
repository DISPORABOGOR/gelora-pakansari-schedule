import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ecpdgtoxzptxsqjbbyoz.supabase.co';
const supabaseAnonKey = 'sb_publishable_C75-TsZBngUo4jyyqBqAAg_V8WaZH5a';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
