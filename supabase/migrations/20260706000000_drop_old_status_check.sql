DO $$
BEGIN
  -- Drop the auto-generated CHECK constraint from the original bootstrap migration
  -- which allowed only ('upcoming', 'joined', 'completed'). The session scheduling
  -- migration (20260527120000_session_scheduling.sql) added a new constraint allowing
  -- ('scheduled', 'live', 'ended'), but never dropped the original. Both constraints
  -- on the same column make INSERT/UPDATE impossible since no single value satisfies both.
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'sessions_status_check1'
      AND conrelid = 'sessions'::regclass
  ) THEN
    ALTER TABLE sessions DROP CONSTRAINT sessions_status_check1;
  END IF;
END $$;
