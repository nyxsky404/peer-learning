-- Decouple the Jitsi video room identifier from the sessions.id primary key.
--
-- sessions.id is a well-distributed UUIDv4, but it is also the row's primary
-- key: it flows through URLs, application logs, error trackers, and every
-- other query against the sessions table. Reusing it as the sole "secret"
-- protecting a third-party video room (meet.jit.si, which performs no
-- authorization of its own beyond knowing the room name) means any future
-- leak of that identifier through an unrelated surface also grants entry to
-- the live video session. Giving the video room its own dedicated,
-- cryptographically random token limits exposure to just this feature and
-- lets it be rotated independently of the session's primary key.

ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS jitsi_room_token TEXT;

-- Backfill existing rows with a random 32-byte hex token.
UPDATE public.sessions
SET jitsi_room_token = encode(gen_random_bytes(32), 'hex')
WHERE jitsi_room_token IS NULL;

ALTER TABLE public.sessions
  ALTER COLUMN jitsi_room_token SET DEFAULT encode(gen_random_bytes(32), 'hex'),
  ALTER COLUMN jitsi_room_token SET NOT NULL;

ALTER TABLE public.sessions
  ADD CONSTRAINT sessions_jitsi_room_token_unique UNIQUE (jitsi_room_token);

-- jitsi_room_token is covered by the same RLS policies already enforced on
-- the sessions table (mentor_id / learner_id = auth.uid()), so only the two
-- participants of a session can ever read their room's token.
