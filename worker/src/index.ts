interface Env {
  DB: D1Database;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  JWT_SECRET: string;
  FRONTEND_URL: string;
  WORKER_URL: string;
}

function b64url(input: string): string {
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function b64urlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return atob(str);
}

async function signJWT(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) }));
  const data = `${header}.${body}`;
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return `${data}.${b64url(String.fromCharCode(...new Uint8Array(sig)))}`;
}

async function verifyJWT(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const [header, body, sig] = token.split(".");
    if (!header || !body || !sig) return null;
    const key = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
    );
    const sigBytes = Uint8Array.from(atob(sig.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify("HMAC", key, sigBytes, new TextEncoder().encode(`${header}.${body}`));
    if (!valid) return null;
    const p = JSON.parse(b64urlDecode(body));
    if (p.exp && Date.now() / 1000 > p.exp) return null;
    return p;
  } catch { return null; }
}

function corsHeaders(origin: string): Record<string, string> {
  const allowed = ["https://msharisq.github.io", "http://localhost:3000", "http://localhost:3001"];
  return {
    "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0],
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

function json(data: unknown, status = 200, origin = ""): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

async function getUser(req: Request, env: Env) {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return verifyJWT(auth.slice(7), env.JWT_SECRET);
}

// ── GET /api/health ───────────────────────────────────────────────────────────
function handleHealth(): Response {
  return new Response(JSON.stringify({ status: "ok" }), {
    headers: { "Content-Type": "application/json" },
  });
}

// ── GET /api/stats ────────────────────────────────────────────────────────────
async function handleStats(env: Env, origin: string): Promise<Response> {
  const row = await env.DB.prepare(
    `SELECT COUNT(*) as total,
     COUNT(CASE WHEN date(created_at) = date('now') THEN 1 END) as today
     FROM users`
  ).first<{ total: number; today: number }>();
  return json({ total_users: row?.total ?? 0, new_today: row?.today ?? 0 }, 200, origin);
}

// ── GET /api/badge ────────────────────────────────────────────────────────────
async function handleBadge(env: Env): Promise<Response> {
  const row = await env.DB.prepare("SELECT COUNT(*) as total FROM users").first<{ total: number }>();
  const count = row?.total ?? 0;
  const value = count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);
  const lw = 50, vw = value.length * 7 + 14, tw = lw + vw;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tw}" height="20">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <rect rx="3" width="${tw}" height="20" fill="#555"/>
  <rect rx="3" x="${lw}" width="${vw}" height="20" fill="#10b981"/>
  <rect rx="3" width="${tw}" height="20" fill="url(#s)"/>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="${lw / 2}" y="15" fill="#010101" fill-opacity=".3">users</text>
    <text x="${lw / 2}" y="14">users</text>
    <text x="${lw + vw / 2}" y="15" fill="#010101" fill-opacity=".3">${value}</text>
    <text x="${lw + vw / 2}" y="14">${value}</text>
  </g>
</svg>`;
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "no-cache, max-age=0" },
  });
}

// ── GET /api/auth/github ──────────────────────────────────────────────────────
function handleAuthGitHub(env: Env): Response {
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: `${env.WORKER_URL}/api/auth/callback`,
    scope: "user:email read:user",
    state: crypto.randomUUID(),
  });
  return Response.redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
}

// ── GET /api/auth/callback ────────────────────────────────────────────────────
async function handleAuthCallback(req: Request, env: Env): Promise<Response> {
  const code = new URL(req.url).searchParams.get("code");
  if (!code) return Response.redirect(`${env.FRONTEND_URL}?error=no_code`, 302);

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${env.WORKER_URL}/api/auth/callback`,
      }),
    });
    const { access_token } = await tokenRes.json() as { access_token?: string };
    if (!access_token) return Response.redirect(`${env.FRONTEND_URL}?error=token_failed`, 302);

    const ghUser = await (await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}`, "User-Agent": "SkillForge" },
    })).json() as { id: number; login: string; name: string; avatar_url: string; email: string; bio: string };

    await env.DB.prepare(`
      INSERT INTO users (github_id, username, name, avatar_url, email, bio, last_login)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(github_id) DO UPDATE SET
        username = excluded.username, name = excluded.name,
        avatar_url = excluded.avatar_url, email = excluded.email,
        bio = excluded.bio, last_login = CURRENT_TIMESTAMP
    `).bind(String(ghUser.id), ghUser.login, ghUser.name || ghUser.login,
      ghUser.avatar_url, ghUser.email || "", ghUser.bio || "").run();

    const token = await signJWT({
      sub: String(ghUser.id),
      username: ghUser.login,
      name: ghUser.name || ghUser.login,
      avatar: ghUser.avatar_url,
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    }, env.JWT_SECRET);

    return Response.redirect(`${env.FRONTEND_URL}/auth/callback/?token=${token}`, 302);
  } catch (e) {
    const msg = encodeURIComponent(e instanceof Error ? e.message : String(e));
    return Response.redirect(`${env.FRONTEND_URL}?error=auth_failed&detail=${msg}`, 302);
  }
}

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
async function handleMe(req: Request, env: Env, origin: string): Promise<Response> {
  const user = await getUser(req, env);
  if (!user) return json({ error: "Unauthorized" }, 401, origin);
  const row = await env.DB.prepare("SELECT * FROM users WHERE github_id = ?").bind(user.sub).first();
  return json(row, 200, origin);
}

// ── GET /api/users/:username ──────────────────────────────────────────────────
async function handleProfile(username: string, env: Env, origin: string): Promise<Response> {
  const row = await env.DB.prepare(
    "SELECT github_id, username, name, avatar_url, bio, created_at FROM users WHERE username = ?"
  ).bind(username).first() as Record<string, unknown> | null;
  if (!row) return json({ error: "User not found" }, 404, origin);

  const progressStats = await env.DB.prepare(`
    SELECT roadmap_id, COUNT(*) as completed
    FROM user_roadmap_progress WHERE github_id = ?
    GROUP BY roadmap_id
  `).bind(row.github_id).all();

  const bookmarkStats = await env.DB.prepare(`
    SELECT type, COUNT(*) as count
    FROM user_bookmarks WHERE github_id = ?
    GROUP BY type
  `).bind(row.github_id).all();

  const nodesCompleted = (progressStats.results as { completed: number }[])
    .reduce((sum, r) => sum + r.completed, 0);
  const roadmapsStarted = progressStats.results.length;
  const certCount = (bookmarkStats.results as { type: string; count: number }[])
    .find(r => r.type === "certification")?.count ?? 0;
  const courseCount = (bookmarkStats.results as { type: string; count: number }[])
    .find(r => r.type === "course")?.count ?? 0;

  return json({
    ...row,
    stats: {
      roadmaps_started: roadmapsStarted,
      nodes_completed: nodesCompleted,
      certs_bookmarked: certCount,
      courses_bookmarked: courseCount,
    },
    progress: progressStats.results,
  }, 200, origin);
}

// ── GET /api/progress?roadmap_id=xxx ─────────────────────────────────────────
async function handleProgressGet(req: Request, env: Env, origin: string): Promise<Response> {
  const user = await getUser(req, env);
  if (!user) return json({ error: "Unauthorized" }, 401, origin);
  const roadmapId = new URL(req.url).searchParams.get("roadmap_id");
  if (!roadmapId) return json({ error: "roadmap_id required" }, 400, origin);
  const rows = await env.DB.prepare(
    "SELECT node_id FROM user_roadmap_progress WHERE github_id = ? AND roadmap_id = ?"
  ).bind(user.sub, roadmapId).all();
  return json({ completed: (rows.results as { node_id: string }[]).map(r => r.node_id) }, 200, origin);
}

// ── POST /api/progress ────────────────────────────────────────────────────────
async function handleProgressPost(req: Request, env: Env, origin: string): Promise<Response> {
  const user = await getUser(req, env);
  if (!user) return json({ error: "Unauthorized" }, 401, origin);
  const { roadmap_id, node_id } = await req.json() as { roadmap_id: string; node_id: string };
  await env.DB.prepare(
    "INSERT OR IGNORE INTO user_roadmap_progress (github_id, roadmap_id, node_id) VALUES (?, ?, ?)"
  ).bind(user.sub, roadmap_id, node_id).run();
  return json({ ok: true }, 200, origin);
}

// ── DELETE /api/progress ──────────────────────────────────────────────────────
async function handleProgressDelete(req: Request, env: Env, origin: string): Promise<Response> {
  const user = await getUser(req, env);
  if (!user) return json({ error: "Unauthorized" }, 401, origin);
  const { roadmap_id, node_id } = await req.json() as { roadmap_id: string; node_id: string };
  await env.DB.prepare(
    "DELETE FROM user_roadmap_progress WHERE github_id = ? AND roadmap_id = ? AND node_id = ?"
  ).bind(user.sub, roadmap_id, node_id).run();
  return json({ ok: true }, 200, origin);
}

// ── GET /api/bookmarks ────────────────────────────────────────────────────────
async function handleBookmarksGet(req: Request, env: Env, origin: string): Promise<Response> {
  const user = await getUser(req, env);
  if (!user) return json({ error: "Unauthorized" }, 401, origin);
  const rows = await env.DB.prepare(
    "SELECT type, item_id, created_at FROM user_bookmarks WHERE github_id = ? ORDER BY created_at DESC"
  ).bind(user.sub).all();
  return json({ bookmarks: rows.results }, 200, origin);
}

// ── POST /api/bookmarks ───────────────────────────────────────────────────────
async function handleBookmarksPost(req: Request, env: Env, origin: string): Promise<Response> {
  const user = await getUser(req, env);
  if (!user) return json({ error: "Unauthorized" }, 401, origin);
  const { type, item_id } = await req.json() as { type: string; item_id: string };
  await env.DB.prepare(
    "INSERT OR IGNORE INTO user_bookmarks (github_id, type, item_id) VALUES (?, ?, ?)"
  ).bind(user.sub, type, item_id).run();
  return json({ ok: true }, 200, origin);
}

// ── DELETE /api/bookmarks ─────────────────────────────────────────────────────
async function handleBookmarksDelete(req: Request, env: Env, origin: string): Promise<Response> {
  const user = await getUser(req, env);
  if (!user) return json({ error: "Unauthorized" }, 401, origin);
  const { type, item_id } = await req.json() as { type: string; item_id: string };
  await env.DB.prepare(
    "DELETE FROM user_bookmarks WHERE github_id = ? AND type = ? AND item_id = ?"
  ).bind(user.sub, type, item_id).run();
  return json({ ok: true }, 200, origin);
}

// ── Router ────────────────────────────────────────────────────────────────────
export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(req.url);
    const origin = req.headers.get("Origin") ?? "";

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });

    if (pathname === "/api/health") return handleHealth();
    if (pathname === "/api/stats") return handleStats(env, origin);
    if (pathname === "/api/badge") return handleBadge(env);
    if (pathname === "/api/auth/github") return handleAuthGitHub(env);
    if (pathname === "/api/auth/callback") return handleAuthCallback(req, env);
    if (pathname === "/api/auth/me") return handleMe(req, env, origin);

    if (pathname === "/api/progress") {
      if (req.method === "GET") return handleProgressGet(req, env, origin);
      if (req.method === "POST") return handleProgressPost(req, env, origin);
      if (req.method === "DELETE") return handleProgressDelete(req, env, origin);
    }

    if (pathname === "/api/bookmarks") {
      if (req.method === "GET") return handleBookmarksGet(req, env, origin);
      if (req.method === "POST") return handleBookmarksPost(req, env, origin);
      if (req.method === "DELETE") return handleBookmarksDelete(req, env, origin);
    }

    const profileMatch = pathname.match(/^\/api\/users\/([^/]+)$/);
    if (profileMatch) return handleProfile(profileMatch[1], env, origin);

    return json({ error: "Not found" }, 404, origin);
  },
};
