/**
 * Sperrt interne Dateien. Cloudflare Pages veröffentlicht das ganze Repo (pages_build_output_dir = "."),
 * ohne diese Sperre waren CLAUDE.md, docs/, scripts/, migrations/, wrangler.toml usw. öffentlich abrufbar.
 * Ausnahme: docs/news-regeln.md und docs/news-routine.md – die News-Routine liest beide per curl von der Live-Seite.
 * Die Middleware läuft nur auf den Pfaden aus _routes.json; neue Function-Pfade oder Sperren dort mit eintragen.
 */
const FREI = ['/docs/news-regeln.md', '/docs/news-routine.md'];
const ORDNER = ['/docs/', '/scripts/', '/migrations/', '/tmp/', '/.github/', '/functions/', '/node_modules/'];
const DATEIEN = ['/claude.md', '/wrangler.toml', '/package.json', '/package-lock.json', '/.gitignore'];

export function gesperrt(pfad) {
  const p = decodeURIComponent(pfad).toLowerCase();
  if (FREI.includes(p)) return false;
  return DATEIEN.includes(p) || ORDNER.some((o) => p.startsWith(o) || p === o.slice(0, -1));
}

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  let frei = false;
  try { frei = !gesperrt(url.pathname); } catch { frei = false; }
  if (frei) {
    const r = await next();
    if (!FREI.includes(url.pathname)) return r;
    const h = new Headers(r.headers);
    h.set('X-Robots-Tag', 'noindex');
    return new Response(r.body, { status: r.status, headers: h });
  }
  const seite = await env.ASSETS.fetch(new URL('/404.html', url)).catch(() => null);
  return new Response(seite && seite.ok ? seite.body : 'Nicht gefunden', {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex', 'Cache-Control': 'no-store' },
  });
}
