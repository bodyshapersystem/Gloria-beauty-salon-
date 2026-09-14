import { NextResponse } from 'next/server';

function normalize(s: string) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

function score(title: string, query: string) {
  const a = new Set(normalize(title).split(' ').filter(x => x.length > 1));
  const b = normalize(query).split(' ').filter(x => x.length > 1);
  if (!b.length) return 0;
  return b.filter(x => a.has(x)).length / b.length;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  if (!q) return NextResponse.json({ ok: false, error: 'missing query' }, { status: 400 });
  try {
    const endpoint = `https://goodbyeinventory.com/search/suggest.json?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=10&resources[options][unavailable_products]=show`;
    const r = await fetch(endpoint, { headers: { 'user-agent': 'Mozilla/5.0' }, next: { revalidate: 3600 } });
    if (!r.ok) throw new Error(`GBI ${r.status}`);
    const data = await r.json();
    const products = data?.resources?.results?.products || [];
    if (!products.length) return NextResponse.json({ ok: false, query: q, image: null });
    const ranked = products.map((p: any) => ({ p, s: score(p.title || '', q) })).sort((a: any,b: any) => b.s - a.s);
    const best = ranked[0]?.p;
    const image = best?.image || best?.featured_image?.url || best?.featured_image || null;
    const url = best?.url ? new URL(best.url, 'https://goodbyeinventory.com').toString() : null;
    return NextResponse.json({ ok: !!image, query: q, title: best?.title || null, image, url, score: ranked[0]?.s || 0 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, query: q, image: null, error: e?.message || 'lookup failed' }, { status: 200 });
  }
}
