import fs from 'fs';

async function fetchSchema() {
  const url = 'https://utzkooyrdhapwvrjnffj.supabase.co/rest/v1/';
  const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0emtvb3lyZGhhcHd2cmpuZmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNzIyMjgsImV4cCI6MjA4NDk0ODIyOH0.0HwwoJl1cJ093r68zF2Kmr4sa3Ngt3VRjIpZl1UKhz4';
  
  const res = await fetch(url, { headers: { 'apikey': apikey } });
  const json = await res.json();
  fs.writeFileSync('scratch/openapi.json', JSON.stringify(json, null, 2));
  console.log('Done');
}

fetchSchema();
