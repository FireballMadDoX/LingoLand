import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://utzkooyrdhapwvrjnffj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0emtvb3lyZGhhcHd2cmpuZmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNzIyMjgsImV4cCI6MjA4NDk0ODIyOH0.0HwwoJl1cJ093r68zF2Kmr4sa3Ngt3VRjIpZl1UKhz4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Checking user_progress schema...');
  // To get columns, we can intentionally trigger an error by inserting a bad row or we can just fetch one row and hope it has keys.
  // Since it's empty, we can't get keys from data. Let's try inserting a dummy row with an invalid column to see the error message.
  const { data, error } = await supabase.from('user_progress').insert({ test_invalid_col: 1 }).select();
  console.log('Error:', error);
}

check();
