(() => {
  "use strict";
  const STORAGE_KEY = "biblioteca-bluray-v2-data";
  const SETTINGS_KEY = "biblioteca-bluray-v2-settings";
  const state = { view:"owned", category:"filmes", movies:[], offers:[], selectedMovieId:null, settings:{} };

  function loadSettings() {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    state.settings = { apiUrl:saved.apiUrl || window.BIBLIOTECA_CONFIG?.apiUrl || "", apiToken:saved.apiToken || "" };
  }
  function saveSettings(settings) { state.settings = {...state.settings,...settings}; localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings)); }
  function loadLocal() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      state.movies = Array.isArray(parsed?.movies) ? parsed.movies : structuredClone(window.BIBLIOTECA_SEED || []);
      state.offers = Array.isArray(parsed?.offers) ? parsed.offers : [];
    } catch { state.movies = structuredClone(window.BIBLIOTECA_SEED || []); state.offers = []; }
    persistLocal();
  }
  function persistLocal() { localStorage.setItem(STORAGE_KEY, JSON.stringify({movies:state.movies,offers:state.offers})); }
  function num(v) { const n=Number(v); return Number.isFinite(n)?n:0; }
  function total(offer) { return num(offer.price)+num(offer.shipping)+num(offer.fees); }
  function activeOffers(movieId) { return state.offers.filter(o=>o.movieId===movieId && o.status==="active"); }
  function bestOffer(movieId) { return [...activeOffers(movieId)].sort((a,b)=>total(a)-total(b))[0] || null; }
  function getMovie(id) { return state.movies.find(m=>m.id===id); }
  function slug(title) {
    const base=String(title||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || `filme-${Date.now()}`;
    let id=base,i=2; while(state.movies.some(m=>m.id===id)) id=`${base}-${i++}`; return id;
  }
  async function api(action,payload={}) {
    if(!state.settings.apiUrl) throw new Error("API não configurada");
    const response=await fetch(state.settings.apiUrl,{method:"POST",redirect:"follow",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action,token:state.settings.apiToken,...payload})});
    const data=await response.json(); if(!data.ok) throw new Error(data.error||"Erro na API"); return data;
  }
  async function sync() {
    const data=await api("bootstrap"); state.movies=data.movies||[]; state.offers=data.offers||[]; persistLocal(); return data;
  }
  async function write(action,payload) { if(state.settings.apiUrl) await api(action,payload); }
  async function saveMovie(input) {
    const existing=input.id?getMovie(input.id):null, now=new Date().toISOString();
    const movie={
      id:input.id||slug(input.title), title:String(input.title||"").trim(), year:num(input.year)||"", status:input.status||"owned",
      category:input.category||"filmes", priority:input.priority||"", targetPrice:num(input.targetPrice), limitPrice:num(input.limitPrice),
      coverUrl:String(input.coverUrl||"").trim(), tags:Array.isArray(input.tags)?input.tags:[], notes:String(input.notes||"").trim(),
      createdAt:existing?.createdAt||now, updatedAt:now
    };
    if(existing) Object.assign(existing,movie); else state.movies.push(movie); persistLocal(); await write("saveMovie",{movie}); return movie;
  }
  async function saveOffer(input) {
    const now=new Date().toISOString();
    const offer={
      id:input.id || (crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(16).slice(2)}`), movieId:input.movieId,
      store:String(input.store||"").trim(), seller:String(input.seller||"").trim(), price:num(input.price), shipping:num(input.shipping), fees:num(input.fees),
      condition:input.condition||"", url:String(input.url||"").trim(), checkedAt:input.checkedAt||"", status:input.status||"active", notes:String(input.notes||"").trim(),
      createdAt:input.createdAt||now, updatedAt:now
    };
    const existing=state.offers.find(o=>o.id===offer.id); if(existing) Object.assign(existing,offer); else state.offers.push(offer); persistLocal(); await write("saveOffer",{offer}); return offer;
  }
  async function markOwned(id) { const m=getMovie(id); if(!m)return; m.status="owned";m.updatedAt=new Date().toISOString();persistLocal();await write("saveMovie",{movie:m}); }
  async function toggleOffer(id) { const o=state.offers.find(x=>x.id===id);if(!o)return;o.status=o.status==="active"?"ended":"active";o.updatedAt=new Date().toISOString();persistLocal();await write("saveOffer",{offer:o}); }
  async function replaceRemote() { return api("replaceAll",{movies:state.movies,offers:state.offers}); }
  function replaceLocal(data) { if(!Array.isArray(data.movies)||!Array.isArray(data.offers)) throw new Error("Arquivo inválido"); state.movies=data.movies;state.offers=data.offers;persistLocal(); }

  loadSettings(); loadLocal();
  window.LibraryData={state,num,total,activeOffers,bestOffer,getMovie,saveSettings,sync,saveMovie,saveOffer,markOwned,toggleOffer,replaceRemote,replaceLocal,persistLocal};
})();
