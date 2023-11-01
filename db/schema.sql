CREATE EXTENSION IF NOT EXISTS vector;

CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- domains
CREATE TABLE domains(
  id serial PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
  scheme text NOT NULL DEFAULT 'https',
  subdomain text,
  domain text UNIQUE,
  max_depth integer NOT NULL DEFAULT 3,
  highest_crawl_after integer NOT NULL DEFAULT 0,
  visited_at timestamp with time zone
);

CREATE OR REPLACE TRIGGER domains_update_updated_at
  BEFORE UPDATE ON domains
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- domain_paths
CREATE TYPE crawl_status AS ENUM(
  'WAITING_TO_BE_CRAWLED',
  'CRAWLING',
  'CRAWLING_COMPLETED'
);

CREATE TABLE domain_paths(
  id serial PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
  visited_at timestamp with time zone,
  domain_id integer REFERENCES domains(id) ON DELETE CASCADE,
  path text NOT NULL,
  depth integer NOT NULL,
  meta_title text,
  meta_description text,
  status_code integer,
  crawl_status crawl_status DEFAULT 'WAITING_TO_BE_CRAWLED',
  UNIQUE (domain_id, path)
);

CREATE OR REPLACE TRIGGER domain_paths_update_updated_at
  BEFORE UPDATE ON domain_paths
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- embedding_chunks
CREATE TABLE embedding_chunks(
  id serial PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  domain_path_id integer REFERENCES domain_paths(id) ON DELETE CASCADE,
  chunk_text text NOT NULL,
  embedding VECTOR(1536)
);

