import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://utzkooyrdhapwvrjnffj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0emtvb3lyZGhhcHd2cmpuZmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNzIyMjgsImV4cCI6MjA4NDk0ODIyOH0.0HwwoJl1cJ093r68zF2Kmr4sa3Ngt3VRjIpZl1UKhz4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const userId = '2dd097bf-cb16-4cac-a88f-6d15ab3fb0fe'; // from previous output
  
  // Attempt to update profiles with various likely column names
  const testCols = ['progress', 'progress_data', 'stats', 'user_progress', 'metadata'];
  
  for (const col of testCols) {
    const { error } = await supabase.from('profiles').update({ [col]: { test: 1 } }).eq('id', userId);
    if (!error) {
       console.log(`Column ${col} EXISTS and is updateable!`);
    } else {
       console.log(`Column ${col} error:`, error.message);
    }
  }
}

check();
