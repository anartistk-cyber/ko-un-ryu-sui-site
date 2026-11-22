CREATE TABLE requests (receipt TEXT PRIMARY KEY, created TEXT NOT NULL, track TEXT NOT NULL, intent TEXT NOT NULL, answers TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', application TEXT, question_version INTEGER NOT NULL DEFAULT 1, submission_id TEXT UNIQUE, line_accepted INTEGER NOT NULL DEFAULT 0);
--> statement-breakpoint
CREATE TABLE sessions (token TEXT PRIMARY KEY, expires INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE login_limits (bucket TEXT PRIMARY KEY, until INTEGER NOT NULL, attempts INTEGER NOT NULL);
