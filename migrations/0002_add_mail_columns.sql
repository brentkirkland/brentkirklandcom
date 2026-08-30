-- Add email sending columns for queued replies
ALTER TABLE submissions ADD COLUMN mail_subject TEXT;
ALTER TABLE submissions ADD COLUMN mail_body TEXT;
ALTER TABLE submissions ADD COLUMN mailed_at TEXT;
