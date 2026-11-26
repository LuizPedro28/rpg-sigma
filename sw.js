const V='mesa-v12',SHELL=['./','manifest.webmanifest','icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);if(r.method!=='GET')return;
  const same=u.origin===location.origin,cdn=u.hostname==='cdn.jsdelivr.net';
  if(!same&&!cdn)return; // Supabase (API, realtime, storage) nunca passa pelo cache
  const keep=x=>{if(x.ok){const c=x.clone();caches.open(V).then(h=>h.put(r,c))}return x};
  if(same)e.respondWith(fetch(r).then(keep).catch(()=>caches.match(r).then(m=>m||caches.match('./'))));
  else e.respondWith(caches.match(r).then(m=>m||fetch(r).then(keep)));
});
