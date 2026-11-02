document.querySelector('.nav-toggle')?.addEventListener('click',()=>{const nav=document.querySelector('.nav');const open=nav.classList.toggle('open');document.querySelector('.nav-toggle').setAttribute('aria-expanded',String(open));});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.nav')?.classList.remove('open')));
const d=document.createElement('dialog');d.className='lightbox';d.innerHTML='<button class="lightbox-close" aria-label="Close image">Close ×</button><img alt="">';document.body.appendChild(d);
d.querySelector('button').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d)d.close()});
document.querySelectorAll('a.fullsize').forEach(a=>{a.addEventListener('click',e=>{if(!d.showModal)return;e.preventDefault();const img=d.querySelector('img');img.src=a.href;img.alt=a.querySelector('img')?.alt||'Project figure';d.showModal();})});

// Preserve reading position between the overview and a project page.
try {
  const rootHome = /(?:^|\/)index\.html$/.test(location.pathname) && !/\/(projects|research|publications)\//.test(location.pathname);
  if(rootHome){
    const homeLinks=[...document.querySelectorAll('a[data-return]')];
    homeLinks.forEach(a=>a.addEventListener('click',()=>{sessionStorage.setItem('xinyu_return',JSON.stringify({anchor:a.dataset.return,y:window.scrollY,time:Date.now()}));}));
    const stored=sessionStorage.getItem('xinyu_return');
    if(stored && location.hash){
      const state=JSON.parse(stored);
      if(location.hash.slice(1)===state.anchor && Date.now()-state.time<1000*60*40){
        // Wait for images to settle, then return to the exact reading position.
        window.addEventListener('load',()=>requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:state.y,behavior:'instant'}))),{once:true});
        sessionStorage.removeItem('xinyu_return');
      }
    }
  }
}catch(e){}

// The design-process slides can be scrolled with a trackpad, touch, or the arrow buttons.
document.querySelectorAll('[data-carousel]').forEach(box=>{
  const track=box.querySelector('.plan-track'), slides=[...box.querySelectorAll('.plan-slide')];
  const prev=box.querySelector('.carousel-prev'), next=box.querySelector('.carousel-next'), count=box.querySelector('.carousel-count');
  function current(){ const d=slides.map(x=>Math.abs(x.offsetLeft-track.offsetLeft-track.scrollLeft)); return d.indexOf(Math.min(...d)); }
  function update(){const i=current();count.textContent=String(i+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');prev.disabled=i===0;next.disabled=i===slides.length-1;}
  function go(i){slides[Math.max(0,Math.min(i,slides.length-1))].scrollIntoView({behavior:'smooth',inline:'start',block:'nearest'});}
  prev.addEventListener('click',()=>go(current()-1));next.addEventListener('click',()=>go(current()+1));
  track.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});
  track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(current()+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(current()-1)}});
  window.addEventListener('resize',update);update();
});
