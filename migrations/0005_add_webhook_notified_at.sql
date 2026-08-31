-- Track webhook delivery separately from mail status so the scheduled sweep
-- (which re-fires the webhook for stale status='new' rows) doesn't
-- re-notify a row the live POST /hi request path (or an earlier sweep run)
-- already sent a webhook for.
ALTER TABLE submissions ADD COLUMN webhook_notified_at TEXT;

CREATE INDEX IF NOT EXISTS idx_submissions_status_webhook_notified_at
  ON submissions(status, webhook_notified_at);
