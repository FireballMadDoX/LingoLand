import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://utzkooyrdhapwvrjnffj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0emtvb3lyZGhhcHd2cmpuZmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNzIyMjgsImV4cCI6MjA4NDk0ODIyOH0.0HwwoJl1cJ093r68zF2Kmr4sa3Ngt3VRjIpZl1UKhz4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Checking profiles table...');
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) console.error('Profiles error:', error);
  else console.log('Profiles data:', data);

  console.log('Checking user_progress table...');
  const { data: d2, error: e2 } = await supabase.from('user_progress').select('*').limit(1);
  if (e2) console.error('user_progress error:', e2);
  else console.log('user_progress data:', d2);
}

check();
