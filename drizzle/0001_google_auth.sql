CREATE TABLE IF NOT EXISTS auth_transactions (
 state_hash TEXT PRIMARY KEY NOT NULL,
 verifier TEXT NOT NULL,
 return_to TEXT NOT NULL,
 expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS auth_transactions_expiry ON auth_transactions(expires_at);
CREATE TABLE IF NOT EXISTS auth_sessions (
 token_hash TEXT PRIMARY KEY NOT NULL,
 user_id TEXT NOT NULL,
 email TEXT NOT NULL,
 full_name TEXT,
 expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS auth_sessions_expiry ON auth_sessions(expires_at);

