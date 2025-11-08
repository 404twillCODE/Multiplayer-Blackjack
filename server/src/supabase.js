// Supabase server-side configuration
// Note: For server-side operations, you may want to use the service role key
// Keep this secure and never expose it to the client

// For now, we'll use environment variables
// In production, set these as environment variables on your server

const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';

// Note: The server will primarily receive balance updates from the client
// The client handles the Supabase operations directly for security
// This file is here for potential future server-side operations

module.exports = {
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY
};

