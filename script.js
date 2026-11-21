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
function updateSavedCount(){const el=$('#savedCount');if(el)el.textContent=saved.length+' title(s) in My List'}
function titleFor(button){return button.dataset.title||button.closest('.poster-card,.trend-card')?.querySelector('b')?.textContent?.trim()||'Dune: Part Two'}
function syncSavedButtons(){ $$('.poster-save,.trend-save').forEach(button=>{const title=titleFor(button);const active=saved.includes(title);button.classList.toggle('saved',active);button.textContent=active?'✓':'＋';button.setAttribute('aria-pressed',String(active))});const hero=$('#heroSave');if(hero){const active=saved.includes('Dune: Part Two');hero.classList.toggle('saved',active);hero.innerHTML=active?'✓ <span>In My List</span>':'＋ <span>My list</span>';hero.setAttribute('aria-pressed',String(active))}updateSavedCount()}
function toggleSaved(button){const title=titleFor(button);saved=saved.includes(title)?saved.filter(x=>x!==title):[...saved,title];persistSaved();syncSavedButtons();notify(saved.includes(title)?title+' added to My List':title+' removed from My List')}
$$('.poster-save,.trend-save').forEach(button=>button.addEventListener('click',()=>toggleSaved(button)));
$('#heroSave')?.addEventListener('click',e=>toggleSaved(e.currentTarget));
$('#heroWatch')?.addEventListener('click',()=>notify('Player integration is not connected yet'));
$('#heroMore')?.addEventListener('click',()=>notify('Dune: Part Two · Sci-Fi · Drama'));
/* Settings */
const settings=$('#settingsModal');
function openSettings(){if(!settings)return;settings.classList.add('open');settings.setAttribute('aria-hidden','false');$('#themeSetting').value=prefs.theme;$('#accentSetting').value=prefs.accent;$('#motionSetting').checked=prefs.reduceMotion;$('#effectsSetting').checked=prefs.lightEffects;updateSavedCount();$('#settingsClose')?.focus()}
function closeSettings(){settings?.classList.remove('open');settings?.setAttribute('aria-hidden','true');$('#settingsBtn')?.focus()}
$('#settingsBtn')?.addEventListener('click',openSettings);
$('#settingsClose')?.addEventListener('click',closeSettings);
$('#settingsDone')?.addEventListener('click',closeSettings);
settings?.addEventListener('click',e=>{if(e.target===settings)closeSettings()});
$('#themeSetting')?.addEventListener('change',e=>{prefs.theme=e.target.value;savePrefs();applyPrefs()});
$('#accentSetting')?.addEventListener('change',e=>{prefs.accent=e.target.value;savePrefs();applyPrefs()});
$('#motionSetting')?.addEventListener('change',e=>{prefs.reduceMotion=e.target.checked;savePrefs();applyPrefs()});
$('#effectsSetting')?.addEventListener('change',e=>{prefs.lightEffects=e.target.checked;savePrefs();applyPrefs()});
$('#resetSettings')?.addEventListener('click',()=>{prefs={...defaults};savePrefs();applyPrefs();openSettings();notify('Settings reset')});
$('#clearSaved')?.addEventListener('click',()=>{if(!saved.length){notify('My List is already empty');return}saved=[];persistSaved();syncSavedButtons();notify('My List cleared')});
/* Search */
const modal=$('#searchModal'),input=$('#searchInput');
function openSearch(){if(!modal||!input)return;modal.classList.add('open');setTimeout(()=>input.focus(),30)}
function closeSearch(){modal?.classList.remove('open');if(input){input.value='';filterSearch('')}}
$('#searchOpen')?.addEventListener('click',openSearch);$('#searchTrigger')?.addEventListener('click',openSearch);$('#searchClose')?.addEventListener('click',closeSearch);
modal?.addEventListener('click',e=>{if(e.target===modal)closeSearch()});
function filterSearch(q){let count=0;$$('.poster-card,.trend-card,.episode').forEach(card=>{const match=!q||card.textContent.toLowerCase().includes(q);card.hidden=!match;if(match&&q)count++});const hint=$('#searchHint');if(hint)hint.textContent=q?(count?count+' matching title(s) in this preview.':'No matching preview titles.'):'Search across your cinema universe.'}
input?.addEventListener('input',()=>filterSearch(input.value.trim().toLowerCase()));
/* Category filters */
$$('.filters button').forEach(button=>button.addEventListener('click',()=>{$$('.filters button').forEach(item=>item.classList.remove('active'));button.classList.add('active');$$('.trend-card').forEach(card=>{card.hidden=!(button.dataset.filter==='all'||card.dataset.kind===button.dataset.filter)})}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(settings?.classList.contains('open'))closeSettings();else closeSearch()}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch()}});
$$('.rail-link').forEach(link=>link.addEventListener('click',()=>{$$('.rail-link').forEach(item=>item.classList.remove('active'));link.classList.add('active')}));
$$('.top-nav a').forEach(link=>link.addEventListener('click',()=>{$$('.top-nav a').forEach(item=>item.classList.remove('active'));link.classList.add('active')}));
applyPrefs();syncSavedButtons();
