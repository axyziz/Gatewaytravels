
const SUPABASE_URL = "https://ajlkweolggmgmbikqfhe.supabase.co";

const SUPABASE_KEY = "sb_publishable_ytDyn-0nK2uNvcBuIl4XOg_Yay4H5FI";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
console.log("Supabase Connected", supabaseClient);
