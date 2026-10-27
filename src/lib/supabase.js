import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Keys nasle tar null: app junya local products.js var chalto
export const supabase = url && key ? createClient(url, key) : null;