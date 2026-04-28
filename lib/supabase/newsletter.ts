import { SupabaseClient } from '@supabase/supabase-js'

export async function insertSubscriber(supabase: SupabaseClient, formData: any) {
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .insert([
      {
        name: formData.name || null,
        email: formData.email,
        interest: formData.interest || null,
        dob: formData.dob || null
      }
    ]);

  return { data, error };
}
