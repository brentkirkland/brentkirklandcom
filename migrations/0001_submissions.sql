-- Create submissions table for /hi persistence
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  stroke_count INTEGER NOT NULL,
  point_count INTEGER NOT NULL,
  drawing_key TEXT NOT NULL,
  strokes_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
