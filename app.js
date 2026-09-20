(() => {
  "use strict";
  const D=window.LibraryData,U=window.LibraryUI,S=D.state,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  async function run(task,success){try{await task();U.render();U.detail();if(success)U.toast(success);}catch(e){U.toast(`Falha na nuvem: ${e.message}. Alteração mantida localmente.`);U.render();U.detail();}}
  async function sync(show=true){if(!S.settings.apiUrl){if(show)U.toast("Configure o Apps Script para sincronizar.");return;}U.syncStatus("Sincronizando...");try{await D.sync();U.render();U.detail();U.syncStatus(`Sincronizado em ${new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}`);if(show)U.toast("Dados sincronizados.");}catch(e){U.syncStatus(`Falha: ${e.message}`);if(show)U.toast(`Falha ao sincronizar: ${e.message}`);}}
  function moviePayload(f){return{id:f.elements.id.value,title:f.elements.title.value,year:f.elements.year.value,status:f.elements.status.value,category:f.elements.category.value,priority:f.elements.priority.value,targetPrice:f.elements.targetPrice.value,limitPrice:f.elements.limitPrice.value,coverUrl:f.elements.coverUrl.value,tags:f.elements.tags.value.split(",").map(x=>x.trim()).filter(Boolean),notes:f.elements.notes.value};}
  function offerPayload(f){return{movieId:f.elements.movieId.value,store:f.elements.store.value,seller:f.elements.seller.value,price:f.elements.price.value,shipping:f.elements.shipping.value,fees:f.elements.fees.value,condition:f.elements.condition.value,url:f.elements.url.value,checkedAt:f.elements.checkedAt.value,status:f.elements.status.value,notes:f.elements.notes.value};}
  function exportJson(){const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),movies:S.movies,offers:S.offers},null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`biblioteca-bluray-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);}
  document.addEventListener("click",e=>{
    const close=e.target.closest("[data-close]");if(close){$(`#${close.dataset.close}`).close();return;}
    const view=e.target.closest("[data-view]");if(view){S.view=view.dataset.view;S.category="filmes";U.render();return;}
    const cat=e.target.closest("[data-category]");if(cat){S.category=cat.dataset.category;U.render();return;}
    const card=e.target.closest("[data-movie-id]");if(card&&!e.target.closest("button,a")){U.openMovie(card.dataset.movieId);return;}
    const a=e.target.closest("[data-action]");if(!a)return;const id=a.dataset.id;
    if(a.dataset.action==="add-movie")U.movieForm();
    if(a.dataset.action==="edit-movie")U.movieForm(id);
    if(a.dataset.action==="add-offer")U.offerForm(id,"offer");
    if(a.dataset.action==="add-purchase")U.offerForm(id,"purchase");
    if(a.dataset.action==="mark-owned")run(()=>D.markOwned(id),"Movido para a coleção.");
    if(a.dataset.action==="end-offer")run(()=>D.toggleOffer(id));
    if(a.dataset.action==="settings")U.settings();
    if(a.dataset.action==="sync")sync();
    if(a.dataset.action==="export-json")exportJson();
    if(a.dataset.action==="push-remote"){if(!S.settings.apiUrl){U.toast("Configure a URL do Apps Script primeiro.");return;}if(confirm("Enviar os dados deste navegador para a planilha e substituir os dados atuais da API?")){U.syncStatus("Enviando dados locais...");run(()=>D.replaceRemote(),"Dados enviados para a planilha.");}}
    if(a.dataset.action==="home")window.scrollTo({top:0,behavior:"smooth"});
  });
  $("#search").addEventListener("input",U.movies);$("#sort").addEventListener("change",U.movies);
  $("#movie-form").addEventListener("submit",e=>{e.preventDefault();const f=e.currentTarget;run(async()=>{const m=await D.saveMovie(moviePayload(f));S.selectedMovieId=m.id;f.closest("dialog").close();},"Filme salvo.");});
  $("#offer-form").addEventListener("submit",e=>{e.preventDefault();const f=e.currentTarget;run(async()=>{await D.saveOffer(offerPayload(f));f.closest("dialog").close();},"Oferta salva.");});
  ["price","shipping","fees"].forEach(n=>$("#offer-form").elements[n].addEventListener("input",U.offerPreview));
  $("#settings-form").addEventListener("submit",async e=>{e.preventDefault();D.saveSettings({apiUrl:e.currentTarget.elements.apiUrl.value.trim(),apiToken:e.currentTarget.elements.apiToken.value});U.syncStatus(S.settings.apiUrl?"Configuração salva. Testando conexão...":"Modo local ativado.");if(S.settings.apiUrl)await sync(false);else U.toast("Configuração salva.");});
  $("#import-json").addEventListener("change",async e=>{const file=e.target.files?.[0];if(!file)return;try{D.replaceLocal(JSON.parse(await file.text()));U.render();U.toast("Backup importado.");}catch(err){U.toast(err.message);}e.target.value="";});
  $$("dialog").forEach(dialog=>dialog.addEventListener("click",e=>{const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}));
  U.render();if(S.settings.apiUrl)sync(false);
})();
