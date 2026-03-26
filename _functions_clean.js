function buildFilters(){
  const counts={};
  TERMS.forEach(t=>{counts[t.d]=(counts[t.d]||0)+1});
  const main=document.getElementById('mainFilters');
  let html='<button class="filter-btn active" data-filter="all">All<span class="cnt">'+TERMS.length+'</span></button>';
  Object.entries(MAIN_GROUPS).forEach(([group,domains])=>{
    const total=domains.reduce((s,d)=>s+(counts[d]||0),0);
    if(total>0)html+='<button class="filter-btn" data-filter="'+group+'">'+group+'<span class="cnt">'+total+'</span></button>';
  });
  main.innerHTML=html;
  main.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.onclick=()=>{
      main.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      activeMain=btn.dataset.filter;
      activeSub='';
      activeSubCat='';
      buildSubFilters(counts);
      document.getElementById('subCatFilters').classList.remove('open');
      document.getElementById('subCatFilters').innerHTML='';
      activeLetter='';
      document.querySelectorAll('.alpha-btn').forEach(b=>b.classList.remove('active'));
      render();
    };
  });
  buildSubFilters(counts);
}

function buildSubFilters(counts){
  const sub=document.getElementById('subFilters');
  if(activeMain==='all'){sub.classList.remove('open');sub.innerHTML='';return;}
  const domains=MAIN_GROUPS[activeMain]||[];
  if(domains.length<=1){sub.classList.remove('open');sub.innerHTML='';
    if(domains.length===1)activeSub=domains[0];
    render();return;
  }
  let html='<button class="sub-btn'+(activeSub?'':' active')+'" data-sub="">All in group</button>';
  domains.forEach(d=>{
    if(counts[d]){
      const cls=d.toLowerCase().replace(/ /g,'-');
      const cfg=DC[d]||{c:'#888',b:'rgba(136,136,136,0.12)'};
      html+='<button class="sub-btn'+(activeSub===d?' active':'')+'" data-sub="'+d+'" style="color:'+cfg.c+'">'+d+'<span class="cnt" style="opacity:.5;margin-left:3px;font-size:10px">'+counts[d]+'</span></button>';
    }
  });
  sub.innerHTML=html;
  sub.classList.add('open');
  sub.querySelectorAll('.sub-btn').forEach(btn=>{
    btn.onclick=()=>{
      sub.querySelectorAll('.sub-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      activeSub=btn.dataset.sub;
      activeSubCat='';
      buildSubCatFilters();
      render();
    };
  });
}

function buildSubCatFilters(){
  const sc=document.getElementById('subCatFilters');
  if(!activeSub||!DOMAIN_SUBS[activeSub]){sc.classList.remove('open');sc.innerHTML='';return;}
  const subs=DOMAIN_SUBS[activeSub];
  const domainTerms=TERMS.filter(t=>t.d===activeSub);
  let html='<button class="sub-btn'+(activeSubCat?'':' active')+'" data-subcat="">All</button>';
  Object.entries(subs).forEach(([label,keywords])=>{
    const count=domainTerms.filter(t=>keywords.some(kw=>t.n.toLowerCase().includes(kw)||((t.k||[]).join(' ')).toLowerCase().includes(kw))).length;
    if(count>0)html+='<button class="sub-btn'+(activeSubCat===label?' active':'')+'" data-subcat="'+label+'">'+label+'<span class="cnt" style="opacity:.5;margin-left:3px;font-size:10px">'+count+'</span></button>';
  });
  sc.innerHTML=html;
  sc.classList.add('open');
  sc.querySelectorAll('.sub-btn').forEach(btn=>{
    btn.onclick=()=>{
      sc.querySelectorAll('.sub-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      activeSubCat=btn.dataset.subcat;
      render();
    };
  });
}

function matchesSubCat(term){
  if(!activeSubCat||!activeSub||!DOMAIN_SUBS[activeSub])return true;
  const keywords=DOMAIN_SUBS[activeSub][activeSubCat];
  if(!keywords)return true;
  const name=term.n.toLowerCase();
  const kws=((term.k||[]).join(' ')).toLowerCase();
  return keywords.some(kw=>name.includes(kw)||kws.includes(kw));
}

function buildAlphabet(){
  const letters=new Set();
  TERMS.forEach(t=>letters.add(t.n.charAt(0).toUpperCase()));
  const c=document.getElementById('alphabet');
  let html='';
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(l=>{
    html+='<button class="alpha-btn'+(letters.has(l)?'':' disabled')+'" data-letter="'+l+'">'+l+'</button>';
  });
  c.innerHTML=html;
  c.querySelectorAll('.alpha-btn:not(.disabled)').forEach(btn=>{
    btn.onclick=()=>{
      const was=btn.classList.contains('active');
      c.querySelectorAll('.alpha-btn').forEach(b=>b.classList.remove('active'));
      if(!was){btn.classList.add('active');activeLetter=btn.dataset.letter;}
      else{activeLetter='';}
      render();
    };
  });
}

function fuzzyMatch(term,query){
  const q=query.toLowerCase();
  const name=term.n.toLowerCase();
  const domain=term.d.toLowerCase();
  const preview=(term.t||'').toLowerCase();
  const kw=(term.k||[]).join(' ').toLowerCase();
  if(name.includes(q))return 4;
  if(domain.includes(q))return 3;
  if(kw.includes(q))return 2;
  if(preview.includes(q))return 1;
  const words=q.split(/\s+/);
  if(words.length>1&&words.every(w=>name.includes(w)||kw.includes(w)||preview.includes(w)||domain.includes(w)))return 1;
  return 0;
}

function highlightText(text,query){
  if(!query)return text;
  const esc=query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return text.replace(new RegExp('('+esc+')','gi'),'<mark>$1</mark>');
}

function getFiltered(){
  let filtered=TERMS;
  const query=document.getElementById('search').value.trim();
  
  if(activeMain!=='all'){
    const domains=MAIN_GROUPS[activeMain]||[];
    if(activeSub)filtered=filtered.filter(t=>t.d===activeSub);
    else filtered=filtered.filter(t=>domains.includes(t.d));
  }
  if(activeSubCat)filtered=filtered.filter(t=>matchesSubCat(t));
  if(activeLetter)filtered=filtered.filter(t=>t.n.charAt(0).toUpperCase()===activeLetter);
  if(query){
    const scored=filtered.map(t=>({t,score:fuzzyMatch(t,query)})).filter(x=>x.score>0);
    scored.sort((a,b)=>b.score-a.score||(a.t.n<b.t.n?-1:1));
    return{terms:scored.map(x=>x.t),query};
  }
  filtered.sort((a,b)=>a.n<b.n?-1:1);
  return{terms:filtered,query:''};
}

function cardHTML(t,query){
  const cls=t.d.toLowerCase().replace(/ /g,'-');
  const name=query?highlightText(t.n,query):t.n;
  const preview=t.t?(query?highlightText(t.t,query):t.t):'';
  return '<a class="term-card" href="'+t.s+'.html"><div class="name">'+name+'</div><span class="domain-tag tag-'+cls+'">'+t.d+'</span>'+(preview?'<div class="preview">'+preview+'</div>':'')+'</a>';
}

function renderCards(terms,query){
  const container=document.getElementById('termContainer');
  if(terms.length===0){
    container.innerHTML='<div class="no-results"><div class="emoji">&#x1F50D;</div><h3>No terms found</h3><p>Try a different search or filter</p></div>';
    return;
  }
  const BATCH=150;
  const show=terms.slice(0,BATCH);
  const rest=terms.slice(BATCH);
  let html='';
  if(currentView==='compact'&&!query){
    let cl='';
    terms.forEach(t=>{
      const l=t.n.charAt(0).toUpperCase();
      if(l!==cl){cl=l;html+='<div class="letter-header">'+l+'</div>';}
      html+=cardHTML(t,query);
    });
  }else{
    show.forEach(t=>{html+=cardHTML(t,query);});
  }
  container.innerHTML=html;
  if(rest.length>0&&currentView!=='compact'){
    let loaded=false;
    const obs=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting&&!loaded){
        loaded=true;
        let extra='';
        rest.forEach(t=>{extra+=cardHTML(t,query);});
        container.insertAdjacentHTML('beforeend',extra);
        obs.disconnect();
      }
    },{rootMargin:'400px'});
    const s=document.createElement('div');
    s.style.height='1px';
    container.appendChild(s);
    obs.observe(s);
  }
}

function showBrowseGroups(){
  browseLevel='groups';browseGroup='';browseDomain='';
  document.getElementById('mainFilters').style.display='none';
  document.getElementById('subFilters').style.display='none';
  document.getElementById('subCatFilters').style.display='none';
  document.getElementById('alphabet').style.display='none';
  document.querySelector('.result-bar').style.display='none';
  document.querySelector('.view-toggle').style.display='none';
  const counts={};
  TERMS.forEach(t=>{counts[t.d]=(counts[t.d]||0)+1});
  let html='<div class="breadcrumb"><span class="current">All Domains</span></div>';
  html+='<div class="browse-grid">';
  Object.entries(MAIN_GROUPS).forEach(([group,domains])=>{
    const meta=GROUP_META[group]||{icon:'📂',desc:''};
    const total=domains.reduce((s,d)=>s+(counts[d]||0),0);
    const domainTags=domains.map(d=>'<span>'+d+' ('+( counts[d]||0)+')</span>').join(' ');
    html+='<div class="browse-card" onclick="showBrowseDomains(\''+group+'\')">';
    html+='<div class="bc-icon">'+meta.icon+'</div>';
    html+='<div class="bc-name">'+group+'</div>';
    html+='<div class="bc-count">'+total+' terms</div>';
    html+='<div class="bc-domains">'+domainTags+'</div>';
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('termContainer').innerHTML=html;
  document.getElementById('resultCount').innerHTML='';
}

function showBrowseDomains(group){
  browseLevel='domains';browseGroup=group;browseDomain='';
  const domains=MAIN_GROUPS[group]||[];
  const counts={};
  TERMS.forEach(t=>{counts[t.d]=(counts[t.d]||0)+1});
  const meta=GROUP_META[group]||{icon:'📂'};
  let html='<div class="breadcrumb">';
  html+='<a onclick="showBrowseGroups()">All Domains</a>';
  html+='<span class="sep">›</span>';
  html+='<span class="current">'+meta.icon+' '+group+'</span>';
  html+='</div>';
  html+='<div class="browse-grid">';
  domains.forEach(d=>{
    const info=DC[d]||{c:'#888',b:'rgba(136,136,136,0.12)'};
    const cnt=counts[d]||0;
    html+='<div class="browse-domain-card" onclick="showBrowseTerms(\''+group+'\',\''+d.replace(/'/g,"\\'")+'\')">';
    html+='<div class="bdc-color" style="background:'+info.c+'"></div>';
    html+='<div class="bdc-name" style="color:'+info.c+'">'+d+'</div>';
    html+='<div class="bdc-count" style="color:'+info.c+'">'+cnt+' terms</div>';
    const subs=DOMAIN_SUBS[d];
    if(subs){html+='<div class="bdc-desc">'+Object.keys(subs).join(' · ')+'</div>';}
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('termContainer').innerHTML=html;
  document.getElementById('resultCount').innerHTML='';
}

function showBrowseTerms(group,domain){
  browseLevel='terms';browseGroup=group;browseDomain=domain;
  document.getElementById('mainFilters').style.display='none';
  document.getElementById('subFilters').style.display='none';
  document.getElementById('alphabet').style.display='flex';
  document.querySelector('.result-bar').style.display='flex';
  document.querySelector('.view-toggle').style.display='flex';
  const subs=DOMAIN_SUBS[domain];
  if(subs){
    document.getElementById('subCatFilters').style.display='flex';
    document.getElementById('subCatFilters').classList.add('open');
    let subHtml='';
    subHtml+='<button class="sub-btn active" data-subcat="">All</button>';
    Object.keys(subs).forEach(k=>{
      subHtml+='<button class="sub-btn" data-subcat="'+k+'">'+k+'</button>';
    });
    document.getElementById('subCatFilters').innerHTML=subHtml;
    document.getElementById('subCatFilters').querySelectorAll('.sub-btn').forEach(btn=>{
      btn.onclick=()=>{
        document.getElementById('subCatFilters').querySelectorAll('.sub-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        activeSubCat=btn.dataset.subcat;
        renderBrowseTerms(group,domain);
      };
    });
  } else {
    document.getElementById('subCatFilters').style.display='none';
  }
  activeSub=domain;
  activeSubCat='';
  activeLetter='';
  renderBrowseTerms(group,domain);
}

function renderBrowseTerms(group,domain){
  let filtered=TERMS.filter(t=>t.d===domain);
  if(activeSubCat)filtered=filtered.filter(t=>matchesSubCat(t));
  if(activeLetter)filtered=filtered.filter(t=>t.n.charAt(0).toUpperCase()===activeLetter);
  filtered.sort((a,b)=>a.n<b.n?-1:1);
  const meta=GROUP_META[group]||{icon:'📂'};
  const info=DC[domain]||{c:'#888'};
  let breadcrumb='<div class="breadcrumb">';
  breadcrumb+='<a onclick="showBrowseGroups()">All Domains</a>';
  breadcrumb+='<span class="sep">›</span>';
  breadcrumb+='<a onclick="showBrowseDomains(\''+group+'\')">'+meta.icon+' '+group+'</a>';
  breadcrumb+='<span class="sep">›</span>';
  breadcrumb+='<span class="current" style="color:'+info.c+'">'+domain+'</span>';
  breadcrumb+='</div>';
  document.getElementById('resultCount').innerHTML='Showing <span>'+filtered.length+'</span> terms in '+domain;
  renderCards(filtered,'');
  const container=document.getElementById('termContainer');
  container.innerHTML=breadcrumb+container.innerHTML;
  const letters=new Set(filtered.map(t=>t.n.charAt(0).toUpperCase()));
  document.querySelectorAll('.alpha-btn').forEach(btn=>{
    const l=btn.dataset.letter;
    if(l){btn.classList.toggle('disabled',!letters.has(l));}
  });
}

function exitBrowseMode(){
  browseLevel='groups';browseGroup='';browseDomain='';
  activeMain='all';activeSub='';activeSubCat='';activeLetter='';
  document.getElementById('mainFilters').style.display='flex';
  document.getElementById('subFilters').style.display='flex';
  document.getElementById('subCatFilters').style.display='flex';
  document.getElementById('alphabet').style.display='flex';
  document.querySelector('.result-bar').style.display='flex';
  document.querySelector('.view-toggle').style.display='flex';
  showBrowseGroups();
}

function render(){
  const{terms,query}=getFiltered();
  document.getElementById('resultCount').innerHTML='Showing <span>'+terms.length+'</span> of '+TERMS.length+' terms';
  renderCards(terms,query);
}

document.getElementById('search').addEventListener('input',function(){
  clearTimeout(searchTimeout);
  const val=this.value.trim();
  document.getElementById('clearBtn').style.display=val?'block':'none';
  document.getElementById('shortcutHint').style.display=val?'none':'block';
  if(val){
    document.getElementById('mainFilters').style.display='none';
    document.getElementById('subFilters').style.display='none';
    document.getElementById('subCatFilters').style.display='none';
    document.getElementById('alphabet').style.display='none';
    document.querySelector('.result-bar').style.display='flex';
    document.querySelector('.view-toggle').style.display='flex';
    searchTimeout=setTimeout(function(){
      const{terms,query}=getFiltered();
      document.getElementById('resultCount').innerHTML='Showing <span>'+terms.length+'</span> results for "'+query+'"';
      renderCards(terms,query);
    },150);
  } else {
    showBrowseGroups();
  }
});
document.getElementById('search').addEventListener('focus',function(){
  document.getElementById('shortcutHint').style.display='none';
});
document.getElementById('search').addEventListener('blur',function(){
  if(!this.value)document.getElementById('shortcutHint').style.display='block';
});

function clearSearch(){
  document.getElementById('search').value='';
  document.getElementById('clearBtn').style.display='none';
  document.getElementById('shortcutHint').style.display='block';
  showBrowseGroups();
}

document.querySelectorAll('.view-btn').forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll('.view-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentView=btn.dataset.view;
    document.getElementById('termContainer').className=currentView;
    render();
  };
});

function randomTerm(){window.location.href=TERMS[Math.floor(Math.random()*TERMS.length)].s+'.html';}
window.addEventListener('scroll',()=>{document.getElementById('topBtn').style.display=window.scrollY>400?'flex':'none';});
document.addEventListener('keydown',e=>{
  if(e.key==='/'&&document.activeElement.tagName!=='INPUT'){e.preventDefault();document.getElementById('search').focus();}
  if(e.key==='Escape'){clearSearch();document.getElementById('search').blur();}
});

buildFilters();
buildAlphabet();
showBrowseGroups();

// Sticky Header
const stickyH=document.getElementById('stickyHeader');
const stickyS=document.getElementById('stickySearch');
const mainS=document.getElementById('search');
window.addEventListener('scroll',()=>{stickyH.classList.toggle('active',window.scrollY>280)});
if(stickyS&&mainS){
  stickyS.addEventListener('input',function(){mainS.value=this.value;mainS.dispatchEvent(new Event('input',{bubbles:true}))});
  mainS.addEventListener('input',function(){stickyS.value=this.value});
}