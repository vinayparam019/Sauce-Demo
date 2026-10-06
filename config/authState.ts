import path from 'path';

// Shared by the `setup` project (writes it) and the API fixtures (read-only, no browser).
export const AUTH_STATE_PATH = path.resolve(__dirname, '../.auth/user.json');
