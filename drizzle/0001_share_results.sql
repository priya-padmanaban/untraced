CREATE TABLE IF NOT EXISTS share_results (
  share_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_key text NOT NULL REFERENCES patterns(route_key),
  created_at timestamptz NOT NULL DEFAULT now(),
  was_first_discovery boolean NOT NULL,
  discovery_ordinal integer NOT NULL,
  route_submission_count integer NOT NULL,
  personal_streak integer NOT NULL DEFAULT 0,
  personally_submitted_before boolean NOT NULL DEFAULT false
);
