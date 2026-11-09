-- Geo/network fields from request.cf on POST /agent.
-- Nullable so existing agent_checkins rows stay unchanged.
ALTER TABLE agent_checkins ADD COLUMN country TEXT;
ALTER TABLE agent_checkins ADD COLUMN region TEXT;
ALTER TABLE agent_checkins ADD COLUMN city TEXT;
ALTER TABLE agent_checkins ADD COLUMN asn INTEGER;
ALTER TABLE agent_checkins ADD COLUMN as_organization TEXT;
