import React, { useEffect, useMemo, useRef, useState } from 'react';

const KEY = 'acl-service-hours-v1';

// Fictional volunteering programs for the self-contained UI/UX exercise.
// Staff names, partners and descriptions are examples, not real university records.
const PROGRAMS = {
  ENV110: {
    name: 'Campus Green Team',
    partner: 'University Sustainability Office',
    description: 'Weekly tree planting, recycling audits and awareness stands that help the campus reduce its waste and energy use.',
    history: [
      {year: '2025/26', supervisors: ['Dr. Heba Lotfy'], coordinators: ['Malak Ashraf', 'Ziad Hamdy']},
      {year: '2024/25', supervisors: ['Dr. Sherif Galal'], coordinators: ['Jana Wael', 'Seif Mostafa']},
    ],
  },
  EDU210: {
    name: 'Peer Tutoring Circle',
    partner: 'Student Learning Center',
    description: 'Senior students run small study groups for first-year courses, preparing worked examples and answering questions.',
    history: [
      {year: '2025/26', supervisors: ['Dr. Nermine Aly'], coordinators: ['Hana Kamal', 'Marwan Essam']},
      {year: '2024/25', supervisors: ['Dr. Waleed Fouad'], coordinators: ['Laila Samy', 'Kareem Ayman']},
    ],
  },
  HLT150: {
    name: 'Blood Drive Crew',
    partner: 'Regional Blood Bank',
    description: 'Volunteers organise campus donation days, register donors and support the medical team on site.',
    history: [
      {year: '2025/26', supervisors: ['Dr. Amr Zaki'], coordinators: ['Salma Reda', 'Omar Hesham']},
      {year: '2024/25', supervisors: ['Dr. Mona Sabry', 'Dr. Amr Zaki'], coordinators: ['Nadia Fikry', 'Tarek Adel']},
    ],
  },
  COM305: {
    name: 'Community Kitchen',
    partner: 'Neighbourhood Food Network',
    description: 'Preparing and packing meals for local families, managing donations and keeping the kitchen inventory up to date.',
    history: [
      {year: '2025/26', supervisors: ['Dr. Ghada Ibrahim'], coordinators: ['Yasmin Talaat', 'Hazem Farid']},
      {year: '2024/25', supervisors: ['Dr. Ghada Ibrahim'], coordinators: ['Rania Saleh', 'Mostafa Emad']},
    ],
  },
  TEC220: {
    name: 'Digital Skills for Seniors',
    partner: 'City Community Library',
    description: 'One-to-one sessions that help older adults use smartphones, video calls, online banking and e-government services safely.',
    history: [
      {year: '2025/26', supervisors: ['Dr. Khaled Mourad'], coordinators: ['Reem Atef', 'Ahmed Nabil']},
      {year: '2024/25', supervisors: ['Dr. Inas Farag'], coordinators: ['Mai Yehia', 'Bassem Hany']},
    ],
  },
};
const getProgram = code => PROGRAMS[code?.toUpperCase()] || {
  name: 'Program details not yet added',
  partner: '—',
  description: 'This program does not have a profile in the example directory.',
  history: [],
};
const isListed = code => Boolean(PROGRAMS[code?.toUpperCase()]);
const readRoute = () => {
  const match = window.location.hash.match(/^#\/programs\/([^/?#]+)$/);
  return match ? decodeURIComponent(match[1]).toUpperCase() : null;
};
const programHref = code => `#/programs/${encodeURIComponent(code.toUpperCase())}`;
const seed = [
  {id:'e1',programCode:'ENV110',hours:3,reflection:'Planting day was well organised and the team lead explained every step.',owner:'you',name:'You',date:'2026-10-11'},
  {id:'e2',programCode:'EDU210',hours:2,reflection:'If you prepare examples in advance the sessions run smoothly.',owner:'other',name:'Habiba',date:'2026-10-08'},
  {id:'e3',programCode:'HLT150',hours:6,reflection:'Long shift but very rewarding. Bring water and snacks.',owner:'other',name:'Omar',date:'2026-10-03'},
  {id:'e4',programCode:'COM305',hours:4,reflection:'Packing went quickly once roles were clear.',owner:'you',name:'You',date:'2026-09-29'},
  {id:'e5',programCode:'TEC220',hours:2,reflection:'Patience matters more than technical knowledge here.',owner:'other',name:'Lina',date:'2026-09-25'},
  {id:'e6',programCode:'ENV110',hours:5,reflection:'Recycling audit took longer than planned.',owner:'other',name:'Youssef',date:'2026-09-19'},
  {id:'e7',programCode:'EDU210',hours:3,reflection:'Students asked great questions about recursion.',owner:'other',name:'Mariam',date:'2026-09-12'},
  {id:'e8',programCode:'HLT150',hours:8,reflection:'',owner:'other',name:'Ali',date:'2026-09-05'},
  {id:'e9',programCode:'COM305',hours:1,reflection:'Short orientation session only.',owner:'other',name:'Nour',date:'2026-08-28'},
  {id:'e10',programCode:'ENV110',hours:2,reflection:'Good for a first volunteering experience.',owner:'other',name:'Farah',date:'2026-08-20'},
];
function loadEntries(){try{const s=JSON.parse(localStorage.getItem(KEY));return Array.isArray(s)?s:seed;}catch{return seed;}}
const HOURS = [1,2,3,4,5,6,7,8];
const meanHours = a => a.length?(a.reduce((s,e)=>s+e.hours,0)/a.length).toFixed(1):'—';
const sumHours = a => a.reduce((s,e)=>s+e.hours,0);
const plural = (n,word) => `${n} ${word}${n===1?'':'s'}`;
const fmtDate = d => {const t=new Date(`${d}T00:00:00`);return isNaN(t)?d:t.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});};
const statsFor = (code,entries) => {
  const list = entries.filter(e=>e.programCode.toUpperCase()===code);
  return {code,name:isListed(code)?PROGRAMS[code].name:'Unlisted program',partner:isListed(code)?PROGRAMS[code].partner:'',count:list.length,avg:meanHours(list),total:sumHours(list)};
};

function HoursBadge({hours}){
  return <span className="hours" title={`${hours} of max 8 hours`}>
    <b>{hours} h</b>
    <span className="meter" aria-hidden="true">{HOURS.map(h=><i key={h} className={h<=hours?'on':''}/>)}</span>
  </span>;
}

function EntryCard({e,onEdit,showProgram=true}){
  const mine = e.owner==='you';
  return <article className={`entry${mine?' mine':''}`}>
    <div className="entry-head">
      {showProgram
        ? <a className="entry-program" href={programHref(e.programCode)}><span className="code">{e.programCode}</span><span className="pname">{isListed(e.programCode)?PROGRAMS[e.programCode.toUpperCase()].name:'Unlisted program'}</span></a>
        : <span className="entry-name">{mine?<span className="you-tag">You</span>:e.name}</span>}
      <HoursBadge hours={e.hours}/>
    </div>
    {e.reflection ? <p className="entry-note">“{e.reflection}”</p> : <p className="entry-note none">No reflection added.</p>}
    <footer className="entry-foot">
      <span>{showProgram&&<>{mine?<span className="you-tag">You</span>:e.name} · </>}<time dateTime={e.date}>{fmtDate(e.date)}</time></span>
      {mine&&<button className="text-btn" onClick={()=>onEdit(e)}>Edit</button>}
    </footer>
  </article>;
}

export default function App(){
 const [entries,setEntries] = useState(loadEntries);
 const [query,setQuery] = useState('');
 const [effort,setEffort] = useState('all');
 const [mineOnly,setMineOnly] = useState(false);
 const [lookup,setLookup] = useState('');
 const [drawer,setDrawer] = useState(null);
 const [errors,setErrors] = useState({});
 const [toast,setToast] = useState('');
 const [programCode,setProgramCode] = useState(readRoute);
 const codeRef = useRef(null);
 const hoursRef = useRef(null);
 // The page's main "log hours" button; when it scrolls out of view a floating button takes over.
 const ctaRef = useRef(null);
 const [showFab,setShowFab] = useState(false);
 useEffect(()=>{
  const el = ctaRef.current;
  if(!el||!('IntersectionObserver' in window)){setShowFab(false);return;}
  const io = new IntersectionObserver(([entry])=>setShowFab(!entry.isIntersecting),{rootMargin:'-64px 0px 0px 0px'});
  io.observe(el);
  return ()=>io.disconnect();
 },[programCode]);

 useEffect(()=>{
  const onHash = () => {const c=readRoute();setProgramCode(c);if(c)window.scrollTo({top:0,behavior:'instant'});};
  window.addEventListener('hashchange',onHash);
  return ()=>window.removeEventListener('hashchange',onHash);
 },[]);
 useEffect(()=>localStorage.setItem(KEY,JSON.stringify(entries)),[entries]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),4000);return ()=>clearTimeout(t);},[toast]);
 useEffect(()=>{
  if(!drawer)return;
  const onKey = e => e.key==='Escape'&&setDrawer(null);
  window.addEventListener('keydown',onKey);
  return ()=>window.removeEventListener('keydown',onKey);
 },[drawer]);
 useEffect(()=>{document.title=programCode?`${programCode} · ${getProgram(programCode).name} | Service Hours Hub`:'Service Hours Hub | ACL UI/UX';},[programCode]);

 const goHome = where => {
  if(window.location.hash && window.location.hash!=='#/') window.location.hash='#/';
  setProgramCode(null);
  setTimeout(()=>{
   const el = where && document.getElementById(where);
   el ? el.scrollIntoView({behavior:'smooth'}) : window.scrollTo({top:0,behavior:'smooth'});
  },30);
 };

 // Activity feed
 const shown = useMemo(()=>entries.filter(e=>
  (effort==='all'||e.hours===Number(effort)) &&
  (!mineOnly||e.owner==='you') &&
  `${e.programCode} ${PROGRAMS[e.programCode.toUpperCase()]?.name||''} ${e.reflection} ${e.name}`.toLowerCase().includes(query.trim().toLowerCase())
 ),[entries,query,effort,mineOnly]);
 const filtered = query.trim()||effort!=='all'||mineOnly;
 const clearFilters = () => {setQuery('');setEffort('all');setMineOnly(false);};

 // Overview
 const myEntries = entries.filter(e=>e.owner==='you');
 const programsLogged =[...new Set(entries.map(e=>e.programCode.toUpperCase()))];
 const spread = HOURS.map(h=>({h,count:entries.filter(e=>e.hours===h).length}));
 const peak = Math.max(...spread.map(s=>s.count),1);

 // Programs list + program check (type a code to see its stats)
 const allCodes = [...new Set([...Object.keys(PROGRAMS),...programsLogged])];
 const programRows = useMemo(()=>{
  const q = lookup.trim().toUpperCase();
  const rows = allCodes.map(c=>statsFor(c,entries)).filter(r=>!q||r.code.includes(q)||r.name.toUpperCase().includes(q));
  return rows.length||!q ? rows : [statsFor(q,entries)];
 },[entries,lookup]);

 // Program page
 const program = programCode ? getProgram(programCode) : null;
 const programEntries = programCode ? entries.filter(e=>e.programCode.toUpperCase()===programCode) : [];
 const myProgramEntry = programEntries.find(e=>e.owner==='you');

 // Form
 const myEntryFor = (code,exceptId) => entries.find(e=>e.id!==exceptId&&e.owner==='you'&&e.programCode.toLowerCase()===code.trim().toLowerCase());
 function openDrawer(e,code=''){
  if(e&&e.owner!=='you')return;
  setErrors({});
  setDrawer({id:e?.id||null,programCode:e?.programCode||code,hours:e?String(e.hours):'',reflection:e?.reflection||''});
 }
 function save(ev){ev.preventDefault();
  const next = {};
  const code = drawer.programCode.trim();
  if(!code) next.programCode = 'Enter a program code, for example ENV110.';
  else if(myEntryFor(code,drawer.id)) next.programCode = `You already have an entry for ${code.toUpperCase()}. You can log only one entry per program — edit that entry instead.`;
  if(!/^[1-8]$/.test(drawer.hours.trim())) next.hours = 'Hours must be a whole number from 1 to 8.';
  setErrors(next);
  if(next.programCode){codeRef.current?.focus();return;}
  if(next.hours){hoursRef.current?.focus();return;}
  const data={programCode:code.toUpperCase(),hours:Number(drawer.hours.trim()),reflection:drawer.reflection.trim(),name:'You',owner:'you',date:new Date().toISOString().slice(0,10)};
  if(drawer.id){setEntries(entries.map(e=>e.id===drawer.id?{...e,...data}:e));setToast(`Updated your ${data.programCode} entry.`);}
  else{setEntries([{...data,id:'e-'+Date.now()},...entries]);setToast(`Logged ${plural(data.hours,'hour')} for ${data.programCode}.`);}
  setDrawer(null);
 }
 function resetAll(){
  if(!window.confirm('Restore the example records? Any entries you added or edited will be lost.'))return;
  setEntries(seed);clearFilters();setLookup('');setDrawer(null);setToast('Example data restored.');
 }
 async function copyLink(){
  try{await navigator.clipboard.writeText(window.location.href);setToast('Link copied to clipboard.');}
  catch{setToast(`Share this link: ${window.location.href}`);}
 }

 const draftCode = drawer?.programCode.trim().toUpperCase() || '';
 const draftDup = drawer && draftCode ? myEntryFor(draftCode,drawer.id) : null;

 return <div className="hub">
  <nav className="topbar" aria-label="Main">
   <a className="brand" href="#/" onClick={e=>{e.preventDefault();goHome();}}><span className="brand-mark" aria-hidden="true">◆</span>service<b>hub</b></a>
   <div className="nav-links">
    <button onClick={()=>goHome('programs')}>Programs</button>
    <button onClick={()=>goHome('activity')}>Activity</button>
   </div>
   <div className="topbar-end">
    <span className="avatar" title="Signed in as You" aria-label="Signed in as You">Y</span>
   </div>
  </nav>

  <main className="page">{programCode ? (
   <article className="program-page">
    <button className="back" onClick={()=>goHome('programs')}>← All programs</button>
    <header className="program-hero">
     <div className="program-hero-text">
      <span className="tag">{programCode}</span>
      <h1>{program.name}</h1>
      {program.partner!=='—'&&<p className="partner">In partnership with {program.partner}</p>}
      <p className="desc">{program.description}</p>
      <div className="hero-actions" ref={ctaRef}>
       {myProgramEntry
        ? <button className="on-dark primary" onClick={()=>openDrawer(myProgramEntry)}>Edit my entry ({myProgramEntry.hours} h)</button>
        : <button className="on-dark primary" onClick={()=>openDrawer(null,programCode)}>+ Log hours for {programCode}</button>}
       <button className="on-dark ghost" onClick={copyLink}>Copy link</button>
      </div>
     </div>
     <dl className="hero-stats">
      <div><dt>Avg hours / entry</dt><dd>{meanHours(programEntries)}</dd></div>
      <div><dt>Entries</dt><dd>{programEntries.length}</dd></div>
      <div><dt>Total hours</dt><dd>{sumHours(programEntries)}</dd></div>
     </dl>
    </header>

    <div className="program-grid">
     <section className="card" aria-labelledby="said">
      <div className="card-head"><h2 id="said">What volunteers said</h2><span className="muted">{programEntries.length} {programEntries.length===1?'entry':'entries'}</span></div>
      {programEntries.length
       ? <div className="entry-list">{programEntries.map(e=><EntryCard key={e.id} e={e} onEdit={openDrawer} showProgram={false}/>)}</div>
       : <div className="empty"><p>No one has logged hours for this program yet.</p><button className="secondary" onClick={()=>openDrawer(null,programCode)}>Be the first to log hours</button></div>}
     </section>
     <aside className="card team" aria-labelledby="team">
      <h2 id="team">Program team</h2>
      {program.history.length
       ? program.history.map(h=><div className="team-year" key={h.year}>
          <h3>{h.year}</h3>
          <dl>
           <dt>Faculty supervisor{h.supervisors.length===1?'':'s'}</dt><dd>{h.supervisors.join(', ')}</dd>
           <dt>Student coordinators</dt><dd>{h.coordinators.join(', ')}</dd>
          </dl>
         </div>)
       : <p className="muted">No team records for this program.</p>}
      <p className="fine-print">Illustrative records; all names are fictional.</p>
     </aside>
    </div>
   </article>
  ) : <>
   <header className="intro">
    <div className="intro-text">
     <h1>Community service hours</h1>
     <p>Compare programs by how much time volunteers put in, read what they said, then log your own hours.</p>
    </div>
    <div className="log-cta" ref={ctaRef}>
     <div>
      <h2>Volunteered recently?</h2>
      <p>{myEntries.length
       ? <>You've logged <b>{plural(sumHours(myEntries),'hour')}</b> across <b>{plural(myEntries.length,'program')}</b>.</>
       : 'You haven’t logged any hours yet.'}</p>
     </div>
     <button className="primary big" onClick={()=>openDrawer(null)}>+ Log your hours</button>
    </div>
   </header>

   <section className="overview" aria-label="Overview">
    <div className="kpis">
     <div className="kpi"><span>Entries logged</span><b>{entries.length}</b></div>
     <div className="kpi"><span>Avg hours per entry</span><b>{meanHours(entries)}</b></div>
     <div className="kpi"><span>Programs with activity</span><b>{programsLogged.length}</b></div>
    </div>
    <div className="card chart">
     <h2>How long volunteers spend</h2>
     <p className="muted">Number of entries by hours logged</p>
     <div className="columns" role="img" aria-label={spread.map(s=>`${s.h} h: ${s.count}`).join(', ')}>
      {spread.map(s=><div className="column" key={s.h}>
       <span className="column-count">{s.count||''}</span>
       <div className="column-track"><i style={{height:`${s.count/peak*100}%`}}/></div>
       <small>{s.h}h</small>
      </div>)}
     </div>
    </div>
   </section>

   <section className="card" id="programs" aria-labelledby="programs-h">
    <div className="card-head">
     <div><h2 id="programs-h">Programs</h2><p className="muted">Open a program to see its description, team and every volunteer's reflection.</p></div>
     <label className="search">
      <span className="sr-only">Check a program by code or name</span>
      <input value={lookup} onChange={e=>setLookup(e.target.value)} placeholder="Check a program code, e.g. ENV110" type="search"/>
     </label>
    </div>
    <div className="program-table" role="table" aria-label="Program statistics">
     <div className="prow phead" role="row">
      <span role="columnheader">Program</span><span role="columnheader">Avg h / entry</span><span role="columnheader">Entries</span><span role="columnheader">Total hours</span><span aria-hidden="true"/>
     </div>
     {programRows.map(r=><a className="prow" role="row" key={r.code} href={programHref(r.code)}>
      <span role="cell" className="pcell-name"><span className="code">{r.code}</span><span><b>{r.name}</b>{r.partner&&<small>{r.partner}</small>}</span></span>
      <span role="cell" className="num" data-label="Avg h / entry">{r.avg}</span>
      <span role="cell" className="num" data-label="Entries">{r.count}</span>
      <span role="cell" className="num" data-label="Total hours">{r.total}</span>
      <span role="cell" className="chev" aria-hidden="true">›</span>
     </a>)}
    </div>
    {programRows.length===1&&programRows[0].count===0&&!isListed(programRows[0].code)&&<p className="muted note">No entries yet for “{programRows[0].code}”, and it isn't in the program directory.</p>}
   </section>

   <section className="card" id="activity" aria-labelledby="activity-h">
    <div className="card-head">
     <div><h2 id="activity-h">Recent activity</h2><p className="muted" aria-live="polite">{filtered?`Showing ${shown.length} of ${entries.length} entries`:`${entries.length} entries, newest first`}</p></div>
    </div>
    <div className="filters">
     <label className="search grow"><span className="sr-only">Search entries</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by program, volunteer or reflection"/></label>
     <label><span className="sr-only">Filter by hours</span>
      <select value={effort} onChange={e=>setEffort(e.target.value)}><option value="all">Any hours</option>{HOURS.map(h=><option key={h} value={h}>{plural(h,'hour')}</option>)}</select>
     </label>
     <label className="check"><input type="checkbox" checked={mineOnly} onChange={e=>setMineOnly(e.target.checked)}/>Only my entries</label>
     {filtered&&<button className="text-btn" onClick={clearFilters}>Clear filters</button>}
    </div>
    {shown.length
     ? <div className="entry-grid">{shown.map(e=><EntryCard key={e.id} e={e} onEdit={openDrawer}/>)}</div>
     : <div className="empty"><p>No entries match your filters.</p><button className="secondary" onClick={clearFilters}>Clear filters</button></div>}
   </section>

   <footer className="page-foot">
    <span>Entries are saved in this browser only.</span>
    <button className="text-btn danger" onClick={resetAll}>Reset data</button>
   </footer>
  </>}
  </main>

  <button className={`fab${showFab&&!drawer?' show':''}`} tabIndex={showFab&&!drawer?0:-1} aria-hidden={!(showFab&&!drawer)}
   onClick={()=>programCode&&myProgramEntry?openDrawer(myProgramEntry):openDrawer(null,programCode||'')}>
   {programCode&&myProgramEntry?'Edit my entry':programCode?`+ Log hours for ${programCode}`:'+ Log your hours'}
  </button>

  {toast&&<div className={`toast${showFab&&!drawer?' lifted':''}`} role="status"><span>{toast}</span><button onClick={()=>setToast('')} aria-label="Dismiss">×</button></div>}

  {drawer&&<div className="scrim" onMouseDown={e=>e.target===e.currentTarget&&setDrawer(null)}>
   <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
    <div className="drawer-head">
     <h2 id="drawer-title">{drawer.id?'Edit your entry':'Log volunteering hours'}</h2>
     <button className="close" onClick={()=>setDrawer(null)} aria-label="Close">×</button>
    </div>
    <p className="drawer-intro">You can log one entry per program. Fields marked * are required.</p>
    <form onSubmit={save} noValidate>
     <div className="field">
      <label htmlFor="f-code">Program code *</label>
      <input id="f-code" ref={codeRef} autoFocus={!drawer.programCode} list="program-options" autoComplete="off" value={drawer.programCode}
       onChange={e=>{const v=e.target.value;setDrawer(d=>({...d,programCode:v}));setErrors(x=>({...x,programCode:undefined}));}}
       placeholder="e.g. ENV110" aria-invalid={Boolean(errors.programCode)} aria-describedby="f-code-msg"/>
      <datalist id="program-options">{Object.entries(PROGRAMS).map(([c,p])=><option key={c} value={c}>{p.name}</option>)}</datalist>
      <div id="f-code-msg">
       {errors.programCode ? <p className="error" role="alert">{errors.programCode}</p>
        : draftDup ? <p className="warn">You already logged {draftCode} ({draftDup.hours} h). <button type="button" className="text-btn" onClick={()=>openDrawer(draftDup)}>Edit that entry instead</button></p>
        : draftCode ? <p className="hint">{isListed(draftCode)?`✓ ${PROGRAMS[draftCode].name} · ${PROGRAMS[draftCode].partner}`:'Not in the program directory — you can still log it.'}</p>
        : <p className="hint">Pick from the list or type a code.</p>}
      </div>
     </div>
     <div className="field">
      <label htmlFor="f-hours">Hours *</label>
      <input id="f-hours" ref={hoursRef} autoFocus={Boolean(drawer.programCode)} type="number" inputMode="numeric" min="1" max="8" step="1" className="short"
       value={drawer.hours} onChange={e=>{const v=e.target.value;setDrawer(d=>({...d,hours:v}));setErrors(x=>({...x,hours:undefined}));}}
       aria-invalid={Boolean(errors.hours)} aria-describedby="f-hours-msg"/>
      <div id="f-hours-msg">{errors.hours ? <p className="error" role="alert">{errors.hours}</p> : <p className="hint">Whole number from 1 to 8.</p>}</div>
     </div>
     <div className="field">
      <label htmlFor="f-reflection">Reflection <span className="optional">(optional)</span></label>
      <textarea id="f-reflection" value={drawer.reflection} rows={5} onChange={e=>setDrawer(d=>({...d,reflection:e.target.value}))} placeholder="What did you do? Any tips for future volunteers?"/>
     </div>
     <div className="drawer-actions">
      <button type="submit" className="primary">{drawer.id?'Save changes':'Log hours'}</button>
      <button type="button" className="secondary" onClick={()=>setDrawer(null)}>Cancel</button>
     </div>
    </form>
   </aside>
  </div>}
 </div>;
}
