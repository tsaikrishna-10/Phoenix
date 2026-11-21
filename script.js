const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const toast=$('#toast');let toastTimer;
const STORE='phoenix-ui-v1';
const defaults={theme:'dark',accent:'ember',reduceMotion:false,lightEffects:true};
function readPrefs(){try{return {...defaults,...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch{return {...defaults}}}
let prefs=readPrefs();
function savePrefs(){try{localStorage.setItem(STORE,JSON.stringify(prefs))}catch{}}
function applyPrefs(){document.documentElement.dataset.theme=prefs.theme;document.documentElement.dataset.accent=prefs.accent;document.body.classList.toggle('reduce-motion',prefs.reduceMotion);document.body.classList.toggle('light-effects',prefs.lightEffects)}
function notify(message){if(!toast)return;toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1700)}
function readSaved(){try{return JSON.parse(localStorage.getItem('phoenix-watchlist')||'[]')}catch{return []}}
let saved=readSaved();
function persistSaved(){try{localStorage.setItem('phoenix-watchlist',JSON.stringify(saved))}catch{}updateSavedCount()}
function updateSavedCount(){const label=saved.length+' title(s) in My List';const el=$('#savedCount');const settingsCount=$('#savedCountSettings');if(el)el.textContent=label;if(settingsCount)settingsCount.textContent=label}
function titleFor(button){return button.dataset.title||button.closest('.poster-card,.trend-card')?.querySelector('b')?.textContent?.trim()||'Dune: Part Two'}
function syncSavedButtons(){ $$('.poster-save,.trend-save').forEach(button=>{const title=titleFor(button);const active=saved.includes(title);button.classList.toggle('saved',active);button.textContent=active?'✓':'＋';button.setAttribute('aria-pressed',String(active))});const hero=$('#heroSave');if(hero){const active=saved.includes('Dune: Part Two');hero.classList.toggle('saved',active);hero.innerHTML=active?'✓ <span>In My List</span>':'＋ <span>My list</span>';hero.setAttribute('aria-pressed',String(active))}updateSavedCount()}
function toggleSaved(button){const title=titleFor(button);saved=saved.includes(title)?saved.filter(x=>x!==title):[...saved,title];persistSaved();syncSavedButtons();notify(saved.includes(title)?title+' added to My List':title+' removed from My List')}
$$('.poster-save,.trend-save').forEach(button=>button.addEventListener('click',()=>toggleSaved(button)));
$('#heroSave')?.addEventListener('click',e=>toggleSaved(e.currentTarget));
$('#heroWatch')?.addEventListener('click',()=>notify('Player integration is not connected yet'));
/* Download centre: direct downloads activate only when an authorised file URL is supplied for the title. */
const downloadModal=$('#downloadModal');
function openDownload(){downloadModal?.classList.add('open');downloadModal?.setAttribute('aria-hidden','false')}
function closeDownload(){downloadModal?.classList.remove('open');downloadModal?.setAttribute('aria-hidden','true')}
$('#heroDownload')?.addEventListener('click',openDownload);
$('#downloadClose')?.addEventListener('click',closeDownload);
downloadModal?.addEventListener('click',e=>{if(e.target===downloadModal)closeDownload()});
$('#startDownload')?.addEventListener('click',()=>{
 const url=$('#heroDownload')?.dataset.downloadUrl;
 if(!url){notify('No authorised download source for this title yet');return}
 const link=document.createElement('a');link.href=url;link.download='';link.rel='noopener';document.body.appendChild(link);link.click();link.remove();
});

$('#heroMore')?.addEventListener('click',()=>notify('Dune: Part Two · Sci-Fi · Drama'));
/* Settings control centre */
const settings=$('#settingsModal');
const settingDefaults={
 theme:'dark',accent:'ember',compact:false,reduceMotion:false,lightEffects:true,rememberSection:true,
 quality:'auto',dataSaver:false,autoplay:true,previews:false,skipIntro:true,
 subtitleLanguage:'en',subtitleSize:'medium',subtitleBackground:'dark',audioLanguage:'original',rememberTracks:true,
 newEpisodes:true,newMovies:true,reminders:false,productUpdates:false
};
prefs={...settingDefaults,...prefs};
const settingFields={
 theme:'themeSetting',accent:'accentSetting',compact:'compactSetting',reduceMotion:'motionSetting',lightEffects:'effectsSetting',rememberSection:'rememberSetting',
 quality:'qualitySetting',dataSaver:'dataSaverSetting',autoplay:'autoplaySetting',previews:'previewSetting',skipIntro:'skipIntroSetting',
 subtitleLanguage:'subtitleLanguageSetting',subtitleSize:'subtitleSizeSetting',subtitleBackground:'subtitleBackgroundSetting',audioLanguage:'audioLanguageSetting',rememberTracks:'rememberTracksSetting',
 newEpisodes:'newEpisodesSetting',newMovies:'newMoviesSetting',reminders:'remindersSetting',productUpdates:'productUpdatesSetting'
};
function syncSettingsForm(){
 Object.entries(settingFields).forEach(([key,id])=>{const el=$('#'+id);if(!el)return;if(el.type==='checkbox')el.checked=!!prefs[key];else el.value=prefs[key]??settingDefaults[key]});
 updateSavedCount();
}
function applyPrefs(){
 document.documentElement.dataset.theme=prefs.theme;
 document.documentElement.dataset.accent=prefs.accent;
 document.body.classList.toggle('reduce-motion',!!prefs.reduceMotion);
 document.body.classList.toggle('light-effects',!!prefs.lightEffects);
 document.body.classList.toggle('compact-content',!!prefs.compact);
}
function openSettings(){
 if(!settings)return;
 settings.classList.add('open');settings.setAttribute('aria-hidden','false');
 syncSettingsForm();showSettingsTab('general');$('#settingsClose')?.focus();
}
function closeSettings(){settings?.classList.remove('open');settings?.setAttribute('aria-hidden','true');$('#settingsBtn')?.focus()}
function showSettingsTab(name){
 $$('[data-settings-tab]').forEach(tab=>tab.classList.toggle('active',tab.dataset.settingsTab===name));
 $$('[data-settings-page]').forEach(page=>page.classList.toggle('active',page.dataset.settingsPage===name));
}
$$('[data-settings-tab]').forEach(tab=>tab.addEventListener('click',()=>showSettingsTab(tab.dataset.settingsTab)));
Object.entries(settingFields).forEach(([key,id])=>{
 const el=$('#'+id);if(!el)return;
 el.addEventListener('change',()=>{
  prefs[key]=el.type==='checkbox'?el.checked:el.value;
  savePrefs();applyPrefs();
  notify('Preference saved');
 });
});
function resetAllPrefs(){
 prefs={...settingDefaults};savePrefs();applyPrefs();syncSettingsForm();notify('All preferences reset');
}
$('#settingsBtn')?.addEventListener('click',openSettings);
$('#settingsClose')?.addEventListener('click',closeSettings);
$('#settingsDone')?.addEventListener('click',closeSettings);
$('#resetSettings')?.addEventListener('click',resetAllPrefs);
$('#resetSettingsFooter')?.addEventListener('click',resetAllPrefs);
settings?.addEventListener('click',e=>{if(e.target===settings)closeSettings()});
$('#clearSaved')?.addEventListener('click',()=>{
 if(!saved.length){notify('My List is already empty');return}
 saved=[];persistSaved();syncSavedButtons();notify('My List cleared');
});
/* TMDB-powered catalogue and search. The API key stays server-side in Vercel. */
const TMDB_IMAGE='https://image.tmdb.org/t/p/';
async function tmdb(params){
 const query=new URLSearchParams(params);
 const response=await fetch('/api/tmdb?'+query.toString());
 const payload=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error(payload.error||'TMDB request failed');
 return payload;
}
function tmdbTitle(item){return item.title||item.name||'Untitled'}
function tmdbYear(item){const date=item.release_date||item.first_air_date||'';return date?date.slice(0,4):'—'}
function buildTrendCard(item,index){
 const card=document.createElement('article');card.className='trend-card';card.dataset.kind=item.media_type==='tv'?'series':'movie';
 const rank=document.createElement('span');rank.textContent=String(index+1).padStart(2,'0');
 const thumb=document.createElement('div');thumb.className='trend-thumb';
 if(item.poster_path)thumb.style.backgroundImage='url("'+TMDB_IMAGE+'w185'+item.poster_path+'")';
 const copy=document.createElement('div');const title=document.createElement('b');title.textContent=tmdbTitle(item);
 const meta=document.createElement('small');meta.textContent=tmdbYear(item)+' · '+(item.media_type==='tv'?'TV Series':'Movie');
 copy.append(title,meta);
 const rating=document.createElement('strong');rating.textContent='★ '+(Number(item.vote_average||0).toFixed(1));
 const save=document.createElement('button');save.className='trend-save';save.type='button';save.textContent='＋';save.dataset.title=tmdbTitle(item);
 save.addEventListener('click',()=>toggleSaved(save));
 card.append(rank,thumb,copy,rating,save);return card;
}
async function loadTrending(){
 const grid=$('.trend-grid');if(!grid)return;
 try{
  const data=await tmdb({type:'trending'});
  const items=(data.results||[]).filter(x=>x.media_type==='movie'||x.media_type==='tv').slice(0,12);
  if(!items.length)throw new Error('No trending titles returned');
  grid.replaceChildren(...items.map(buildTrendCard));syncSavedButtons();
 }catch(error){console.error('PHOENIX TMDB trending:',error);notify('Could not load TMDB titles. Check Vercel deployment and API key.')}
}
const modal=$('#searchModal'),input=$('#searchInput'),searchResults=$('#searchResults');
let searchTimer;
function openSearch(){if(!modal||!input)return;modal.classList.add('open');setTimeout(()=>input.focus(),30)}
function closeSearch(){modal?.classList.remove('open');if(input)input.value='';if(searchResults)searchResults.replaceChildren()}
$('#searchOpen')?.addEventListener('click',openSearch);$('#searchTrigger')?.addEventListener('click',openSearch);$('#searchClose')?.addEventListener('click',closeSearch);
modal?.addEventListener('click',e=>{if(e.target===modal)closeSearch()});
function renderSearchResults(items){
 if(!searchResults)return;
 searchResults.replaceChildren();
 items.slice(0,15).forEach(item=>{
  if(!item.media_type||item.media_type==='person')return;
  const row=document.createElement('button');row.type='button';row.className='tmdb-result';
  const poster=document.createElement('img');poster.alt='';poster.loading='lazy';poster.src=item.poster_path?TMDB_IMAGE+'w92'+item.poster_path:'';
  const copy=document.createElement('span');copy.className='tmdb-result-copy';
  const name=document.createElement('b');name.textContent=tmdbTitle(item);
  const meta=document.createElement('small');meta.textContent=(item.media_type==='tv'?'TV Series':'Movie')+' · '+tmdbYear(item)+' · ★ '+Number(item.vote_average||0).toFixed(1);
  copy.append(name,meta);row.append(poster,copy);
  row.addEventListener('click',()=>notify(tmdbTitle(item)+' · TMDB title #'+item.id+' (details view coming next)'));
  searchResults.append(row);
 });
}
async function runTmdbSearch(query){
 if(!searchResults)return;
 if(!query){searchResults.replaceChildren();$('#searchHint').textContent='Search movies and TV shows worldwide.';return}
 $('#searchHint').textContent='Searching TMDB…';
 try{const data=await tmdb({type:'search',q:query});renderSearchResults(data.results||[]);$('#searchHint').textContent=(data.results||[]).length+' TMDB result(s)';}
 catch(error){$('#searchHint').textContent='TMDB search unavailable. Check deployment settings.';console.error(error)}
}
input?.addEventListener('input',()=>{
 const q=input.value.trim();
 clearTimeout(searchTimer);searchTimer=setTimeout(()=>runTmdbSearch(q),350);
});

/* Category filters */
$$('.filters button').forEach(button=>button.addEventListener('click',()=>{$$('.filters button').forEach(item=>item.classList.remove('active'));button.classList.add('active');$$('.trend-card').forEach(card=>{card.hidden=!(button.dataset.filter==='all'||card.dataset.kind===button.dataset.filter)})}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(settings?.classList.contains('open'))closeSettings();else closeSearch()}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch()}});
$$('.rail-link').forEach(link=>link.addEventListener('click',()=>{$$('.rail-link').forEach(item=>item.classList.remove('active'));link.classList.add('active')}));
$$('.top-nav a').forEach(link=>link.addEventListener('click',()=>{$$('.top-nav a').forEach(item=>item.classList.remove('active'));link.classList.add('active')}));
applyPrefs();syncSavedButtons();loadTrending();
