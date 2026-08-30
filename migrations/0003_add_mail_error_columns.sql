-- Add error tracking columns for mail send failures
ALTER TABLE submissions ADD COLUMN mail_error_code TEXT;
ALTER TABLE submissions ADD COLUMN mail_error TEXT;
