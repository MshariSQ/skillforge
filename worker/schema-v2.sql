-- Run with: npx wrangler d1 execute skillforge-db --remote --file schema-v2.sql

CREATE TABLE IF NOT EXISTS user_roadmap_progress (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  github_id   TEXT NOT NULL,
  roadmap_id  TEXT NOT NULL,
  node_id     TEXT NOT NULL,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(github_id, roadmap_id, node_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user ON user_roadmap_progress(github_id);
CREATE INDEX IF NOT EXISTS idx_progress_roadmap ON user_roadmap_progress(github_id, roadmap_id);

CREATE TABLE IF NOT EXISTS user_bookmarks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  github_id   TEXT NOT NULL,
  type        TEXT NOT NULL,
  item_id     TEXT NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(github_id, type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON user_bookmarks(github_id);
