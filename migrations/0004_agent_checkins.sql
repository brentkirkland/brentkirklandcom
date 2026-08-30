-- Agent checkpoint replies from POST /agent. Separate from submissions.
CREATE TABLE IF NOT EXISTS agent_checkins (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  why TEXT NOT NULL,
  token TEXT,
  token_matched INTEGER NOT NULL DEFAULT 0,
  source TEXT,
  rate_limited INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_agent_checkins_created_at ON agent_checkins(created_at);
CREATE INDEX IF NOT EXISTS idx_agent_checkins_ip_created_at ON agent_checkins(ip, created_at);
