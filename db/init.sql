CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE procedure_chunks (
  id SERIAL PRIMARY KEY,
  procedure_id TEXT NOT NULL,
  language TEXT NOT NULL,
  section TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT NOT NULL,
  last_verified DATE NOT NULL,
  embedding vector(1024)
);