// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yjwcgryjnrvmecytnxdb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqd2NncnlqbnJ2bWVjeXRueGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MTYwMzIsImV4cCI6MjA1ODQ5MjAzMn0.fZD2ADtwImZEeHjgzTaZW0r-B9A-iHBdZTzGp2SmlfU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);