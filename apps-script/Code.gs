const CONFIG = {
  SPREADSHEET_ID: '1UNDyes69Lq0ZiHc3f49pzzD-tWeNL3XtO6ZKDi77FrU',
  EDIT_TOKEN: 'TROQUE-ESTE-TOKEN',
  MOVIES_SHEET: 'Biblioteca',
  OFFERS_SHEET: 'Ofertas',
  LEGACY_SHEET: 'Filmes'
};

const MOVIE_HEADERS = ['id','title','year','status','category','priority','targetPrice','limitPrice','coverUrl','tags','notes','createdAt','updatedAt'];
const OFFER_HEADERS = ['id','movieId','store','seller','price','shipping','fees','condition','url','checkedAt','status','notes','createdAt','updatedAt'];

function doGet() { return json_({ok:true, service:'Biblioteca Blu-ray API'}); }
function doPost(e) {
  try {
    var p = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    authorize_(p.token); ensureSheets_();
    if (p.action === 'bootstrap') return json_({ok:true, movies:read_(CONFIG.MOVIES_SHEET,MOVIE_HEADERS), offers:read_(CONFIG.OFFERS_SHEET,OFFER_HEADERS)});
    if (p.action === 'saveMovie') { upsert_(CONFIG.MOVIES_SHEET,MOVIE_HEADERS,p.movie); return json_({ok:true}); }
    if (p.action === 'saveOffer') { upsert_(CONFIG.OFFERS_SHEET,OFFER_HEADERS,p.offer); return json_({ok:true}); }
    if (p.action === 'replaceAll') { replaceAll_(CONFIG.MOVIES_SHEET,MOVIE_HEADERS,p.movies||[]); replaceAll_(CONFIG.OFFERS_SHEET,OFFER_HEADERS,p.offers||[]); return json_({ok:true}); }
    throw new Error('Ação inválida.');
  } catch (err) { return json_({ok:false, error:String(err && err.message ? err.message : err)}); }
}

function setup() { ensureSheets_(); migrateLegacyIfEmpty_(); formatSheets_(); return 'Configuração concluída.'; }
function ss_() { return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID); }
function ensureSheets_() { ensureSheet_(CONFIG.MOVIES_SHEET,MOVIE_HEADERS); ensureSheet_(CONFIG.OFFERS_SHEET,OFFER_HEADERS); }
function ensureSheet_(name, headers) {
  var ss=ss_(), sh=ss.getSheetByName(name); if(!sh) sh=ss.insertSheet(name);
  if(sh.getLastRow()===0){ sh.getRange(1,1,1,headers.length).setValues([headers]); sh.setFrozenRows(1); return; }
  var current=sh.getRange(1,1,1,headers.length).getValues()[0];
  if(headers.some(function(h,i){return current[i]!==h;})) throw new Error('Cabeçalhos inesperados na aba '+name+'.');
}
function authorize_(token){ if(!CONFIG.EDIT_TOKEN || CONFIG.EDIT_TOKEN==='TROQUE-ESTE-TOKEN') throw new Error('Defina CONFIG.EDIT_TOKEN antes de publicar o Apps Script.'); if(token!==CONFIG.EDIT_TOKEN) throw new Error('Token inválido.'); }
function read_(name, headers){ var sh=ss_().getSheetByName(name); if(!sh||sh.getLastRow()<2) return []; return sh.getRange(2,1,sh.getLastRow()-1,headers.length).getValues().filter(function(r){return r.some(function(v){return v!=='';});}).map(function(r){return rowToObject_(r,headers);}); }
function rowToObject_(row,headers){ var o={}; headers.forEach(function(h,i){var v=row[i]; if(h==='tags'){try{v=v?JSON.parse(v):[];}catch(_){v=String(v||'').split(',').map(function(x){return x.trim();}).filter(Boolean);}} if(['year','targetPrice','limitPrice','price','shipping','fees'].indexOf(h)>=0) v=v===''?'':Number(v); o[h]=v;}); return o; }
function objectToRow_(o,headers){ return headers.map(function(h){var v=o&&Object.prototype.hasOwnProperty.call(o,h)?o[h]:''; if(h==='tags') return JSON.stringify(Array.isArray(v)?v:[]); return v==null?'':v;}); }
function upsert_(name,headers,o){ if(!o||!o.id) throw new Error('Registro sem id.'); var sh=ss_().getSheetByName(name), last=sh.getLastRow(), row=last+1; if(last>=2){var ids=sh.getRange(2,1,last-1,1).getValues().map(function(r){return String(r[0]);}), idx=ids.indexOf(String(o.id)); if(idx>=0) row=idx+2;} sh.getRange(row,1,1,headers.length).setValues([objectToRow_(o,headers)]); }
function replaceAll_(name,headers,items){ var sh=ss_().getSheetByName(name); if(sh.getLastRow()>1) sh.getRange(2,1,sh.getLastRow()-1,headers.length).clearContent(); if(items.length) sh.getRange(2,1,items.length,headers.length).setValues(items.map(function(x){return objectToRow_(x,headers);})); }
function migrateLegacyIfEmpty_(){ var ss=ss_(), target=ss.getSheetByName(CONFIG.MOVIES_SHEET), legacy=ss.getSheetByName(CONFIG.LEGACY_SHEET); if(target.getLastRow()>1||!legacy||legacy.getLastRow()<2) return; var rows=legacy.getRange(2,1,legacy.getLastRow()-1,Math.min(6,legacy.getLastColumn())).getValues(), now=new Date().toISOString(), used={}; var movies=rows.filter(function(r){return r[0];}).map(function(r){var title=String(r[0]).trim(), base=slug_(title), id=base, n=2; while(used[id]) id=base+'-'+(n++); used[id]=true; var status=String(r[2]||'').trim(), media=String(r[3]||'').trim(), tags=[]; if(media) tags.push(media); if(status==='Compactado') tags.push('Compactado'); return {id:id,title:title,year:r[1]||'',status:status==='Quero comprar'?'wanted':'owned',category:guessCategory_(title),priority:'',targetPrice:0,limitPrice:0,coverUrl:'',tags:tags,notes:r[5]||'',createdAt:now,updatedAt:now};}); replaceAll_(CONFIG.MOVIES_SHEET,MOVIE_HEADERS,movies); }
function guessCategory_(title){ var t=title.toLowerCase(), keys=['era do gelo','bob esponja','meu malvado favorito','minions','monstros','incríveis','pinguins','wall-e','walle','up:','aviões','hambúrguer','hamburguer','tintim','turbo','angry birds']; return keys.some(function(k){return t.indexOf(k)>=0;})?'infantil':'filmes'; }
function slug_(v){ return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || ('filme-'+Date.now()); }
function formatSheets_(){ [CONFIG.MOVIES_SHEET,CONFIG.OFFERS_SHEET].forEach(function(name){var sh=ss_().getSheetByName(name), cols=name===CONFIG.MOVIES_SHEET?MOVIE_HEADERS.length:OFFER_HEADERS.length; sh.getRange(1,1,1,cols).setFontWeight('bold').setBackground('#1b1b18').setFontColor('#f0eadf'); sh.setFrozenRows(1); sh.autoResizeColumns(1,cols);}); }
function json_(v){ return ContentService.createTextOutput(JSON.stringify(v)).setMimeType(ContentService.MimeType.JSON); }
