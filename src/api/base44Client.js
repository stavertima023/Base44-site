import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68b2a96693fcce1c0da1a6a1", 
  requiresAuth: true // Ensure authentication is required for all operations
});
