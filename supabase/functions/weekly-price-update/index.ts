// supabase/functions/weekly-price-update/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;

serve(async (req) => {
  // Initialize Supabase client
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Fetch all listings
  const { data: listings, error } = await supabase
    .from('listings')
    .select('*')

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 })
  }

  // Update prices (simulated with ChatGPT)
  for (const listing of listings) {
    const mockPrice = `$${Math.floor(Math.random() * 2000) + 1000}` // Replace with actual ChatGPT API call
    await supabase
      .from('listings')
      .update({
        current_price: mockPrice,
        price_history: [...listing.price_history, { date: new Date().toISOString(), price: mockPrice }]
      })
      .eq('id', listing.id)
  }

  return new Response(JSON.stringify({ success: true }))
})
