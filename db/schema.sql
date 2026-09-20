-- 3rdLoop Solutions — catalogue schema (Neon / PostgreSQL).
--
-- Apply with:  npm run db:migrate
--
-- Products and services each keep their scalar columns as real columns so they
-- can be filtered and ordered in SQL, and their repeated sub-records (facts,
-- features, deliverables) as jsonb — those are always read and written whole
-- with their parent row, so a child table would buy nothing.

CREATE TABLE IF NOT EXISTS products (
  slug        text PRIMARY KEY,
  name        text        NOT NULL,
  tagline     text        NOT NULL,
  summary     text        NOT NULL,
  category    text        NOT NULL,
  status      text        NOT NULL,
  enabled     boolean     NOT NULL DEFAULT true,
  url         text,
  icon        text        NOT NULL,
  accent      text        NOT NULL,
  industry    text        NOT NULL,
  facts       jsonb       NOT NULL DEFAULT '[]'::jsonb,
  challenge   text        NOT NULL DEFAULT '',
  approach    text        NOT NULL DEFAULT '',
  features    jsonb       NOT NULL DEFAULT '[]'::jsonb,
  stack       jsonb       NOT NULL DEFAULT '[]'::jsonb,
  outcomes    jsonb       NOT NULL DEFAULT '[]'::jsonb,
  -- Hand-set display order; ties fall back to name so the order is total.
  position    integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- The public catalogue only ever reads enabled rows, in display order.
CREATE INDEX IF NOT EXISTS products_enabled_position_idx
  ON products (enabled, position, name);

CREATE TABLE IF NOT EXISTS services (
  id            text PRIMARY KEY,
  title         text        NOT NULL,
  summary       text        NOT NULL,
  icon          text        NOT NULL,
  color         text        NOT NULL,
  deliverables  jsonb       NOT NULL DEFAULT '[]'::jsonb,
  outcomes      text        NOT NULL DEFAULT '',
  enabled       boolean     NOT NULL DEFAULT true,
  position      integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS services_enabled_position_idx
  ON services (enabled, position, title);
