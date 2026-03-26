const DC = {"Screenplay Writing": {"c": "#e879f9", "b": "rgba(232,121,249,0.12)"}, "Content Creation": {"c": "#fb923c", "b": "rgba(251,146,60,0.12)"}};

let activeMain='all';
let activeSub='';
let activeSubCat='';
let activeLetter='';
let currentView='grid';
let searchTimeout=null;
let browseLevel='groups';
let browseGroup='';
let browseDomain='';

const MAIN_GROUPS={
  'Foundation':['NEOMANITAI','Interaction Effects'],
  'Applied':['Education','Education Learning','Robotics','Workplace','Aging AI','Sports AI','Gaming AI'],
  'Thinking':['Cognitive AI','Perception AI','Knowledge AI','Language AI','Translation AI','Cognitive Shift'],
  'Feeling':['Somatic AI','Behavioral AI','Temporal AI'],
  'Relating':['Relational AI','Social AI','Identity AI'],
  'Creating': ['Creative AI','Design AI','AI Art','Playful AI','Music AI','Photography AI','Screenplay Writing','Content Creation'],
  'Navigating':['Ethics AI','Trust AI','Adaptation AI'],
  'Connecting':['Bridge AI']
};

/* Subcategories within domains — auto-matched by term name keywords */
const DOMAIN_SUBS={'Copywriting':'CPW','Data Science':'DAT','Web Development':'WEB','Software Engineering':'SWE','Education Learning':'EDU',
  'Education':{'Methods':['method','pedagog','teaching','instruction','didact'],'Learning':['learn','student','comprehens','knowledge','literacy'],'Assessment':['assess','evaluat','feedback','test','grade'],'Access':['access','inclus','equity','barrier','gap']},
  'Robotics':{'Sensing':['sensor','detect','recogni','percept','vision'],'Movement':['motor','movement','navig','gesture','mobil'],'Interaction':['collaborat','communic','handoff','trust','interface'],'Safety':['safe','proxim','zone','bound','adapt']},
  'Workplace':{'Productivity':['productiv','efficien','workflow','speed','output'],'Identity':['identit','role','career','professional','skill'],'Collaboration':['collaborat','team','delegat','partner','coordinat'],'Transition':['transition','change','adapt','integrat','transform']},
  'Creative AI':{'Process':['process','workflow','method','iteration','cycle'],'Authenticity':['authent','original','voice','identity','style'],'Output':['output','quality','result','product','generat'],'Delegation':['delegat','automat','handoff','outsourc','reliance']},
  'AI Art':{'Aesthetics':['aesthetic','style','visual','beauty','design'],'Authorship':['author','attribut','ownership','copyright','credit'],'Market':['market','valuat','price','gallery','auction'],'Technology':['algorithm','generat','training','model','data']},
  'Sports AI':{'Performance':['perform','metric','data','predict','analys'],'Coaching':['coach','train','instruct','feedback','decision'],'Athlete':['athlete','player','body','physic','biometr'],'Recovery':['recover','injur','load','rest','fatigue']},
  'Aging AI':{'Accessibility':['accessib','interface','simplif','accommodat','adapt'],'Independence':['independ','autonomy','self','empower','agency'],'Literacy':['literacy','learn','competenc','skill','understand'],'Connection':['connect','social','isolat','communit','family']},
  'Playful AI':{'Interactive':['kick','hunt','laugh','rain','click','check','noise','chain','salad','pause'],'Calming':['calm','relax','sereni','gentle','harmony','soft'],'Motivational':['motiv','energy','pride','excit','optim','heart','joy','inspir','gratitude','grin'],'Error Play':['oops','correct','learn','reset','twist','nudge','mistake','adjust','chill','humor'],'Creative Play':['flex','pivot','fix','drift','bounce','backward','smile','fun','high-five','mini','magic'],'Daily':['flow','discovery','day','morning','daily','end-of-day','smooth','content','lightness','swap']},
  'Bridge AI':{'Context':['context','memory','recall','window','token'],'Prompt':['prompt','steer','instruct','direct','framing'],'Session':['session','lifecycle','start','end','reset'],'Calibration':['calibrat','asymmetr','expectat','mismatch','gap'],'Persona':['persona','identity','character','voice','role'],'Quality':['quality','oscillat','consist','variat','output'],'Emotion':['emotion','project','feel','sentiment','empathy'],'Creative':['creative','co-produc','collaborat','generat','artistic'],'Error':['error','correct','mistak','halluc','repair'],'Training':['training','artifact','pattern','model','learned'],'Multi-Model':['multi','model','cross','switch','compar'],'Attention':['attention','focus','sali','prior','context'],'Speed':['speed','pace','latenc','wait','time'],'Knowledge':['knowledge','boundar','limit','known','uncertain'],'Dependency':['dependen','autonom','reli','self','habit'],'Language':['language','register','tone','formal','style'],'Trust':['trust','verif','reliab','confident','doubt'],'Feedback':['feedback','loop','signal','adjust','adapt']},
  'Design AI':{'Visual Composition':['layout','whitespace','hierarchy','grid','composition','symmetry','proportional','depth','negative','edge','center','diagonal','balance','tension','focal'],'Color & Palette':['palette','saturation','harmony','brand','contrast','temperature','muted','accent','cultural','monochrome'],'Typography':['font','personality','scale','readability','line','letter','typeface','weight','case','script'],'Brand & Identity':['style','logo','consistency','persona','icon','visual','distinctiveness','pattern','symbolic','archetype','lockup','mood','secondary','evolution','institutional'],'Iteration & Refinement':['revision','convergence','feedback','version','incremental','perfect','undo','comparison','history','refinement','divergence','batch','direction'],'Creative Ownership':['attribution','style','originality','intention','creative','authorial','influence','skill','distinction','legacy'],'Tool Dynamics':['prompt','dependency','interface','skill','muscle','template','parameter','rendering','undo','feature','learning','integration','generalization','precision','contextual'],'Aesthetic Judgment':['taste','beauty','novelty','convention','judgment','trend','personal','consensus','uniqueness','aesthetic'],
  'Translation AI':{'Accuracy & Fidelity':['meaning','compress','loss','literal','context','register','flatten','polysem','syntax','reorder','concept','equival','temporal','aspect','tone','color','evidential','numeral'],'Cultural Transfer':['idiom','culture','referent','humor','transfer','taboo','proverb','name','religion','honorif','spatial','orient','kinship','gesture','sacred','secular','mythic'],'Style & Register':['formality','archaic','language','technical','jargon','dialect','erase','voice','authent','slang','poetic','compress','colloquial','sarcasm','euphemism','metadiscourse','rhythm','cadence','interjection','code','switch','syntactic'],'Trust & Verification':['confidence','error','detection','fluency','paradox','verification','silent','failure','hallucin','consistency','expert','novice','false','cognate','contextual','forget','overconfidence','rare','factual','linguistic','ambiguity','smugg','probability'],'Language Learning':['fluency','depth','passive','reception','trap','interference','accel','natural','variability','motivation','bypass','shadow','collocation','pronunciation','decontextual','amnesia','error','immun'],'Professional Use':['translator','ai','boundary','blur','quality','tier','compression','specialization','fragment','client','expectation','revision','burden','shift','certification','crisis','liability','skill','atrophy','workflow','integration','rate','collapse'],'Multilingual Dynamics':['prestige','language','dominance','extinction','code','switch','loanword','localization','script','system','lingua','franca','dialect','preservation','contact','biodiversity','creole'],'Communication Impact':['mediation','invisibility','asynchronous','dialogue','illusion','interpersonal','distance','compression','barrier','collapse','global','homogenization']},
  'Music AI':{'Composition & Creation':['melody','harmonic','harmony','structure','song','composition','bridge','phrase','variation','cadence','rhythm','diminution','augmentation','voice','imitative'],'Genre & Style':['genre','blend','style','transfer','tempo','instrument','groove','dialect','microtonal','lyrical','production','aesthetic','cultural','contamination','authenticity','expectation','anachronistic','tradition'],'Vocal & Lyrics':['vocal','voice','lyric','synthesis','clone','phonetic','prosody','rhyme','metrical','emotional','inflection','syllable','breath','consonant','articulation','vowel','formant','vibrato','cliche','identity','stability'],'Production & Mixing':['production','mix','mastering','compression','reverb','equalization','panning','delay','optimization','spectral','balance','distortion','stereo','width','frequency','clash','sidechain','gate','automation','curve','loudness','standardization'],'Listening & Perception':['listening','perception','emotional','resonance','authentic','artifact','audibility','genre','recognition','repetition','harmonic','surprise','instrumental','tone','believability','structural','coherence','quality','judgment'],'Creative Ownership':['author','copyright','credit','originality','attribution','ownership','authorship','ambiguity','dispute','challenge','distribution','debt','intent','preservation','legibility','residual','influence','invisibility','registration','derivative'],'Emotional Response':['emotion','resonance','feeling','cathartic','mood','sentiment','contagion','authenticity','doubt','melancholy','perception','familiarity','uncanny','arc','disconnection','affective','ambivalence','match','accuracy','transparency','preference','limitation','aesthetic','pleasure','isolation'],'Tool & Workflow':['workflow','iteration','tool','collaboration','integration','adaptation','prompt','precision','learning','dependency','emergence','disruption','human-ai','compositional']},'Photography AI':{'Enhancement & Editing':['instant','polish','underexposure','oversaturation','blur','chromatic','perspective','tonal','color','clarity','shadow','highlight','noise','grain','skin','saturation','vibrance','texture','contrast','vignette'],'Authenticity & Truth':['imperceptible','deepfake','attribution','before','evidence','trust','ethical','reality','undetectable','provenance','viewer','composite','addiction','generat','baseline'],'Aesthetic Control':['style','transfer','grading','lut','cinematic','mood','composition','golden','bokeh','consistency','dimension','subject','contrast','harmonic','vignette','aesthetic','brand'],'Portrait & Identity':['face','eye','tooth','skin','feature','body','beauty','identity','age','ethnic','self','emotion','attractive','likeness','confidence'],'Memory & Documentation':['restoration','memory','nostalgia','documentary','genealog','detail','moment','aesthetic','family','historical'],'Professional Practice':['skill','processing','quality','artistic','workflow','technical','portfolio','pricing','client','polish'],'Social Sharing':['filter','social','algorithmic','influencer','authenticity','viral','mirror','documentation','visual','aesthetic','homogeniz'],'Perception & Reality':['reality','unenhanced','algorithmic','visual','literacy','unmediat']},
  'Gaming AI':{'Opponent Perception':['accept','legitimate','believab','skill','behavior'],'Difficulty & Challenge':['adapt','difficulty','challenge','scaling','fairness'],'Progression & Reward':['achieve','reward','progression','goal','skill'],'Narrative & Agency':['narrative','story','choice','agency','autonomy'],'Social & Competition':['competition','multiplayer','social','interaction','community']}
};


const GROUP_META={
  'Foundation':{icon:'🏛️',desc:'Core phenomena and cross-domain interaction effects'},
  'Applied':{icon:'🎯',desc:'Education, workplace, sports, robotics, and aging'},
  'Thinking':{icon:'🧠',desc:'Cognition, perception, knowledge, and language'},
  'Feeling':{icon:'💫',desc:'Somatic experience, behavior patterns, and time perception'},
  'Relating':{icon:'🤝',desc:'Human-AI relationships, social dynamics, and identity'},
  'Creating':{icon:'✨',desc:'Creative processes, artistic expression, and aesthetic AI'},
  'Trusting':{icon:'🔑',desc:'Trust, ethics, and adaptation in AI interaction'},
  'Connecting':{icon:'🌉',desc:'Bridging human and AI perspectives — 250 new terms'}
};

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


const DC = {"Screenplay Writing": {"c": "#e879f9", "b": "rgba(232,121,249,0.12)"}, "Content Creation": {"c": "#fb923c", "b": "rgba(251,146,60,0.12)"}};

let activeMain='all';
let activeSub='';
let activeSubCat='';
let activeLetter='';
let currentView='grid';
let searchTimeout=null;
let browseLevel='groups';
let browseGroup='';
let browseDomain='';

const MAIN_GROUPS={
  'Foundation':['NEOMANITAI','Interaction Effects'],
  'Applied':['Education','Education Learning','Robotics','Workplace','Aging AI','Sports AI','Gaming AI'],
  'Thinking':['Cognitive AI','Perception AI','Knowledge AI','Language AI','Translation AI','Cognitive Shift'],
  'Feeling':['Somatic AI','Behavioral AI','Temporal AI'],
  'Relating':['Relational AI','Social AI','Identity AI'],
  'Creating': ['Creative AI','Design AI','AI Art','Playful AI','Music AI','Photography AI','Screenplay Writing','Content Creation'],
  'Navigating':['Ethics AI','Trust AI','Adaptation AI'],
  'Connecting':['Bridge AI']
};

/* Subcategories within domains — auto-matched by term name keywords */
const DOMAIN_SUBS={'Copywriting':'CPW','Data Science':'DAT','Web Development':'WEB','Software Engineering':'SWE','Education Learning':'EDU',
  'Education':{'Methods':['method','pedagog','teaching','instruction','didact'],'Learning':['learn','student','comprehens','knowledge','literacy'],'Assessment':['assess','evaluat','feedback','test','grade'],'Access':['access','inclus','equity','barrier','gap']},
  'Robotics':{'Sensing':['sensor','detect','recogni','percept','vision'],'Movement':['motor','movement','navig','gesture','mobil'],'Interaction':['collaborat','communic','handoff','trust','interface'],'Safety':['safe','proxim','zone','bound','adapt']},
  'Workplace':{'Productivity':['productiv','efficien','workflow','speed','output'],'Identity':['identit','role','career','professional','skill'],'Collaboration':['collaborat','team','delegat','partner','coordinat'],'Transition':['transition','change','adapt','integrat','transform']},
  'Creative AI':{'Process':['process','workflow','method','iteration','cycle'],'Authenticity':['authent','original','voice','identity','style'],'Output':['output','quality','result','product','generat'],'Delegation':['delegat','automat','handoff','outsourc','reliance']},
  'AI Art':{'Aesthetics':['aesthetic','style','visual','beauty','design'],'Authorship':['author','attribut','ownership','copyright','credit'],'Market':['market','valuat','price','gallery','auction'],'Technology':['algorithm','generat','training','model','data']},
  'Sports AI':{'Performance':['perform','metric','data','predict','analys'],'Coaching':['coach','train','instruct','feedback','decision'],'Athlete':['athlete','player','body','physic','biometr'],'Recovery':['recover','injur','load','rest','fatigue']},
  'Aging AI':{'Accessibility':['accessib','interface','simplif','accommodat','adapt'],'Independence':['independ','autonomy','self','empower','agency'],'Literacy':['literacy','learn','competenc','skill','understand'],'Connection':['connect','social','isolat','communit','family']},
  'Playful AI':{'Interactive':['kick','hunt','laugh','rain','click','check','noise','chain','salad','pause'],'Calming':['calm','relax','sereni','gentle','harmony','soft'],'Motivational':['motiv','energy','pride','excit','optim','heart','joy','inspir','gratitude','grin'],'Error Play':['oops','correct','learn','reset','twist','nudge','mistake','adjust','chill','humor'],'Creative Play':['flex','pivot','fix','drift','bounce','backward','smile','fun','high-five','mini','magic'],'Daily':['flow','discovery','day','morning','daily','end-of-day','smooth','content','lightness','swap']},
  'Bridge AI':{'Context':['context','memory','recall','window','token'],'Prompt':['prompt','steer','instruct','direct','framing'],'Session':['session','lifecycle','start','end','reset'],'Calibration':['calibrat','asymmetr','expectat','mismatch','gap'],'Persona':['persona','identity','character','voice','role'],'Quality':['quality','oscillat','consist','variat','output'],'Emotion':['emotion','project','feel','sentiment','empathy'],'Creative':['creative','co-produc','collaborat','generat','artistic'],'Error':['error','correct','mistak','halluc','repair'],'Training':['training','artifact','pattern','model','learned'],'Multi-Model':['multi','model','cross','switch','compar'],'Attention':['attention','focus','sali','prior','context'],'Speed':['speed','pace','latenc','wait','time'],'Knowledge':['knowledge','boundar','limit','known','uncertain'],'Dependency':['dependen','autonom','reli','self','habit'],'Language':['language','register','tone','formal','style'],'Trust':['trust','verif','reliab','confident','doubt'],'Feedback':['feedback','loop','signal','adjust','adapt']},
  'Design AI':{'Visual Composition':['layout','whitespace','hierarchy','grid','composition','symmetry','proportional','depth','negative','edge','center','diagonal','balance','tension','focal'],'Color & Palette':['palette','saturation','harmony','brand','contrast','temperature','muted','accent','cultural','monochrome'],'Typography':['font','personality','scale','readability','line','letter','typeface','weight','case','script'],'Brand & Identity':['style','logo','consistency','persona','icon','visual','distinctiveness','pattern','symbolic','archetype','lockup','mood','secondary','evolution','institutional'],'Iteration & Refinement':['revision','convergence','feedback','version','incremental','perfect','undo','comparison','history','refinement','divergence','batch','direction'],'Creative Ownership':['attribution','style','originality','intention','creative','authorial','influence','skill','distinction','legacy'],'Tool Dynamics':['prompt','dependency','interface','skill','muscle','template','parameter','rendering','undo','feature','learning','integration','generalization','precision','contextual'],'Aesthetic Judgment':['taste','beauty','novelty','convention','judgment','trend','personal','consensus','uniqueness','aesthetic'],
  'Translation AI':{'Accuracy & Fidelity':['meaning','compress','loss','literal','context','register','flatten','polysem','syntax','reorder','concept','equival','temporal','aspect','tone','color','evidential','numeral'],'Cultural Transfer':['idiom','culture','referent','humor','transfer','taboo','proverb','name','religion','honorif','spatial','orient','kinship','gesture','sacred','secular','mythic'],'Style & Register':['formality','archaic','language','technical','jargon','dialect','erase','voice','authent','slang','poetic','compress','colloquial','sarcasm','euphemism','metadiscourse','rhythm','cadence','interjection','code','switch','syntactic'],'Trust & Verification':['confidence','error','detection','fluency','paradox','verification','silent','failure','hallucin','consistency','expert','novice','false','cognate','contextual','forget','overconfidence','rare','factual','linguistic','ambiguity','smugg','probability'],'Language Learning':['fluency','depth','passive','reception','trap','interference','accel','natural','variability','motivation','bypass','shadow','collocation','pronunciation','decontextual','amnesia','error','immun'],'Professional Use':['translator','ai','boundary','blur','quality','tier','compression','specialization','fragment','client','expectation','revision','burden','shift','certification','crisis','liability','skill','atrophy','workflow','integration','rate','collapse'],'Multilingual Dynamics':['prestige','language','dominance','extinction','code','switch','loanword','localization','script','system','lingua','franca','dialect','preservation','contact','biodiversity','creole'],'Communication Impact':['mediation','invisibility','asynchronous','dialogue','illusion','interpersonal','distance','compression','barrier','collapse','global','homogenization']},
  'Music AI':{'Composition & Creation':['melody','harmonic','harmony','structure','song','composition','bridge','phrase','variation','cadence','rhythm','diminution','augmentation','voice','imitative'],'Genre & Style':['genre','blend','style','transfer','tempo','instrument','groove','dialect','microtonal','lyrical','production','aesthetic','cultural','contamination','authenticity','expectation','anachronistic','tradition'],'Vocal & Lyrics':['vocal','voice','lyric','synthesis','clone','phonetic','prosody','rhyme','metrical','emotional','inflection','syllable','breath','consonant','articulation','vowel','formant','vibrato','cliche','identity','stability'],'Production & Mixing':['production','mix','mastering','compression','reverb','equalization','panning','delay','optimization','spectral','balance','distortion','stereo','width','frequency','clash','sidechain','gate','automation','curve','loudness','standardization'],'Listening & Perception':['listening','perception','emotional','resonance','authentic','artifact','audibility','genre','recognition','repetition','harmonic','surprise','instrumental','tone','believability','structural','coherence','quality','judgment'],'Creative Ownership':['author','copyright','credit','originality','attribution','ownership','authorship','ambiguity','dispute','challenge','distribution','debt','intent','preservation','legibility','residual','influence','invisibility','registration','derivative'],'Emotional Response':['emotion','resonance','feeling','cathartic','mood','sentiment','contagion','authenticity','doubt','melancholy','perception','familiarity','uncanny','arc','disconnection','affective','ambivalence','match','accuracy','transparency','preference','limitation','aesthetic','pleasure','isolation'],'Tool & Workflow':['workflow','iteration','tool','collaboration','integration','adaptation','prompt','precision','learning','dependency','emergence','disruption','human-ai','compositional']},'Photography AI':{'Enhancement & Editing':['instant','polish','underexposure','oversaturation','blur','chromatic','perspective','tonal','color','clarity','shadow','highlight','noise','grain','skin','saturation','vibrance','texture','contrast','vignette'],'Authenticity & Truth':['imperceptible','deepfake','attribution','before','evidence','trust','ethical','reality','undetectable','provenance','viewer','composite','addiction','generat','baseline'],'Aesthetic Control':['style','transfer','grading','lut','cinematic','mood','composition','golden','bokeh','consistency','dimension','subject','contrast','harmonic','vignette','aesthetic','brand'],'Portrait & Identity':['face','eye','tooth','skin','feature','body','beauty','identity','age','ethnic','self','emotion','attractive','likeness','confidence'],'Memory & Documentation':['restoration','memory','nostalgia','documentary','genealog','detail','moment','aesthetic','family','historical'],'Professional Practice':['skill','processing','quality','artistic','workflow','technical','portfolio','pricing','client','polish'],'Social Sharing':['filter','social','algorithmic','influencer','authenticity','viral','mirror','documentation','visual','aesthetic','homogeniz'],'Perception & Reality':['reality','unenhanced','algorithmic','visual','literacy','unmediat']},
  'Gaming AI':{'Opponent Perception':['accept','legitimate','believab','skill','behavior'],'Difficulty & Challenge':['adapt','difficulty','challenge','scaling','fairness'],'Progression & Reward':['achieve','reward','progression','goal','skill'],'Narrative & Agency':['narrative','story','choice','agency','autonomy'],'Social & Competition':['competition','multiplayer','social','interaction','community']}
};


const GROUP_META={
  'Foundation':{icon:'🏛️',desc:'Core phenomena and cross-domain interaction effects'},
  'Applied':{icon:'🎯',desc:'Education, workplace, sports, robotics, and aging'},
  'Thinking':{icon:'🧠',desc:'Cognition, perception, knowledge, and language'},
  'Feeling':{icon:'💫',desc:'Somatic experience, behavior patterns, and time perception'},
  'Relating':{icon:'🤝',desc:'Human-AI relationships, social dynamics, and identity'},
  'Creating':{icon:'✨',desc:'Creative processes, artistic expression, and aesthetic AI'},
  'Trusting':{icon:'🔑',desc:'Trust, ethics, and adaptation in AI interaction'},
  'Connecting':{icon:'🌉',desc:'Bridging human and AI perspectives — 250 new terms'}
};

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

</script></html>