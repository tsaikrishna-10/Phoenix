const $=(s)=>document.querySelector(s),$$=(s)=>[...document.querySelectorAll(s)];
const toast=$('#toast');let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1900)}
function toggleSaved(button,label){const saved=button.classList.toggle('saved');button.textContent=saved?'✓':'＋';notify(saved?label+' added to My List':label+' removed from My List')}
$$('.poster-save,.trend-save').forEach(button=>button.addEventListener('click',()=>{const card=button.closest('.poster-card,.trend-card');const label=card?.querySelector('b')?.textContent||'Title';toggleSaved(button,label)}));
$('#heroWatch')?.addEventListener('click',()=>notify('Player connection can be added here'));
$('#heroSave')?.addEventListener('click',()=>toggleSaved($('#heroSave'), 'Dune: Part Two'));
$('#heroMore')?.addEventListener('click',()=>notify('Dune: Part Two · Sci-Fi · Drama'));
$('#settingsBtn')?.addEventListener('click',()=>notify('PHOENIX settings are coming soon'));
const modal=$('#searchModal'),input=$('#searchInput');
function openSearch(){modal.classList.add('open');setTimeout(()=>input.focus(),50)}
function closeSearch(){modal.classList.remove('open')}
$('#searchOpen')?.addEventListener('click',openSearch);$('#searchTrigger')?.addEventListener('click',openSearch);$('#searchClose')?.addEventListener('click',closeSearch);
modal?.addEventListener('click',e=>{if(e.target===modal)closeSearch()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSearch();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch()}});
input?.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();let count=0;$$('.poster-card,.trend-card,.episode').forEach(card=>{const match=!q||card.textContent.toLowerCase().includes(q);card.style.display=match?'':'none';if(match&&q)count++});$('#searchHint').textContent=q?(count?count+' matching title(s) in this preview.':'No matching preview titles. Try another search.'):'Search across your cinema universe.'});
$$('.filters button').forEach(button=>button.addEventListener('click',()=>{$$('.filters button').forEach(item=>item.classList.remove('active'));button.classList.add('active');$$('.trend-card').forEach(card=>{card.style.display=button.dataset.filter==='all'||card.dataset.kind===button.dataset.filter?'grid':'none'})}));
$$('.rail-link').forEach(link=>link.addEventListener('click',()=>{$$('.rail-link').forEach(item=>item.classList.remove('active'));link.classList.add('active')}));
$$('.top-nav a').forEach(link=>link.addEventListener('click',()=>{$$('.top-nav a').forEach(item=>item.classList.remove('active'));link.classList.add('active')}));
