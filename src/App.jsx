import React, { useEffect, useMemo, useState } from 'react';

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
const readRoute = () => {
  const match = window.location.hash.match(/^#\/programs\/([^/?#]+)$/);
  return match ? decodeURIComponent(match[1]).toUpperCase() : null;
};
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
const meanHours = a => a.length?(a.reduce((s,e)=>s+e.hours,0)/a.length).toFixed(1):'—';
const sumHours = a => a.reduce((s,e)=>s+e.hours,0);
const pips = n => '●'.repeat(n)+'○'.repeat(Math.max(0,8-n));

function Kpi({label,value,hint}){return <div className="kpi"><span>{label}</span><b>{value}</b><i>{hint}</i></div>;}

export default function App(){
 const [entries,setEntries] = useState(loadEntries);
 const [query,setQuery] = useState('');
 const [effort,setEffort] = useState('all');
 const [lookup,setLookup] = useState('ENV110');
 const [menuOpen,setMenuOpen] = useState(false);
 const [drawer,setDrawer] = useState(null);
 const [problem,setProblem] = useState('');
 const [toast,setToast] = useState('');
 const [view,setView] = useState('Dashboard');
 const [programCode,setProgramCode] = useState(readRoute);
 const [programTab,setProgramTab] = useState('About');
 useEffect(()=>{
  const onHash = () => {setProgramCode(readRoute());setProgramTab('About');window.scrollTo({top:0,behavior:'instant'});};
  window.addEventListener('hashchange',onHash);
  return ()=>window.removeEventListener('hashchange',onHash);
 },[]);
 useEffect(()=>localStorage.setItem(KEY,JSON.stringify(entries)),[entries]);
 const openProgram = code => {window.location.hash=`#/programs/${encodeURIComponent(code)}`;setProgramCode(code.toUpperCase());setProgramTab('About');setMenuOpen(false);window.scrollTo({top:0,behavior:'instant'});};
 const goHome = where => {
  window.location.hash='#/';
  setProgramCode(null);
  if(where==='entries')requestAnimationFrame(()=>document.getElementById('entries')?.scrollIntoView({behavior:'smooth'}));
  else window.scrollTo({top:0,behavior:'smooth'});
 };
 const shown = useMemo(()=>entries.filter(e=>(effort==='all'||e.hours===Number(effort))&&`${e.programCode} ${e.reflection} ${e.name}`.toLowerCase().includes(query.toLowerCase())),[entries,query,effort]);
 const looked = entries.filter(e=>e.programCode.toUpperCase()===lookup.trim().toUpperCase());
 const programsLogged = [...new Set(entries.map(e=>e.programCode))];
 const spread = [1,2,3,4,5,6,7,8].map(h=>({h,count:entries.filter(e=>e.hours===h).length}));
 const peak = Math.max(...spread.map(s=>s.count),1);
 const programEntries = programCode ? entries.filter(e=>e.programCode.toUpperCase()===programCode) : [];
 function openDrawer(e){if(e&&e.owner!=='you')return;setProblem('');setDrawer({id:e?.id||null,programCode:e?.programCode||'',hours:e?String(e.hours):'',reflection:e?.reflection||''});}
 function save(ev){ev.preventDefault();
  if(!drawer.programCode.trim()){setProblem('Missing field.');return;}
  if(!/^[1-8]$/.test(drawer.hours.trim())){setProblem('Invalid value.');return;}
  if(entries.some(e=>e.id!==drawer.id&&e.owner==='you'&&e.programCode.toLowerCase()===drawer.programCode.trim().toLowerCase())){setProblem('Not allowed.');return;}
  const data={programCode:drawer.programCode.trim().toUpperCase(),hours:Number(drawer.hours.trim()),reflection:drawer.reflection.trim(),name:'You',owner:'you',date:new Date().toISOString().slice(0,10)};
  if(drawer.id){setEntries(entries.map(e=>e.id===drawer.id?{...e,...data}:e));setToast('Saved.');}else{setEntries([{...data,id:'e-'+Date.now()},...entries]);setToast('Saved.');}
  setDrawer(null);
 }
 function resetAll(){setEntries(seed);setQuery('');setEffort('all');setLookup('ENV110');setDrawer(null);setToast('Data reset.');}
 const navItems = [['Dashboard',()=>{setView('Dashboard');goHome('top');}],['Entries',()=>{setView('Entries');goHome('entries');}],['My log',()=>{setQuery('You');setView('My log');goHome('entries');}]];
 return <div className="hub">
  <nav className="topbar"><div className="brand"><span className="brand-mark">◆</span>service<b>hub</b></div><div className="tabs">{navItems.map(([label,go])=><a key={label} className={view===label&&!programCode?'on':''} onClick={go}>{label}</a>)}</div><div className="topbar-end"><a className="new-link" onClick={()=>openDrawer(null)}>+ New</a><span className="avatar">Y</span></div></nav>
  <main className="page">{programCode ? (
   <section className="program-page">
    <a className="crumb" onClick={()=>goHome('top')}>‹ Dashboard</a>
    <header className="program-hero">
     <div className="program-hero-text"><span className="tag">{programCode}</span><h1>{getProgram(programCode).name}</h1><p>{getProgram(programCode).partner}</p></div>
     <div className="hero-stats"><div><b>{meanHours(programEntries)}</b><span>avg</span></div><div><b>{programEntries.length}</b><span>logs</span></div></div>
    </header>
    <div className="segmented">{['About','Team','Entries'].map(t=><button key={t} className={programTab===t?'on':''} onClick={()=>setProgramTab(t)}>{t}</button>)}</div>
    {programTab==='About'&&<section className="card about"><h2>About this program</h2><p>{getProgram(programCode).description}</p><dl><dt>Partner</dt><dd>{getProgram(programCode).partner}</dd><dt>Program code</dt><dd>{programCode}</dd></dl></section>}
    {programTab==='Team'&&<section className="card team"><h2>Program team</h2><p className="muted">Faculty supervisors and student coordinators for the last two academic years.</p>
     {getProgram(programCode).history.length ? <div className="team-grid">{getProgram(programCode).history.map(h=><div className="team-year" key={h.year}><h3>{h.year}</h3><span className="label">Supervisor{h.supervisors.length===1?'':'s'}</span><p>{h.supervisors.join(', ')}</p><span className="label">Student coordinators</span><p>{h.coordinators.join(', ')}</p></div>)}</div> : <p className="muted">No example team records for this program.</p>}
     <p className="fine-print">Illustrative program and staff records; all names are fictional.</p>
    </section>}
    {programTab==='Entries'&&<section className="card program-entries"><div className="card-head"><h2>Logged hours</h2><button className="ghost" onClick={()=>openDrawer(null)}>+ Log</button></div>
     {programEntries.length ? <ul className="timeline">{programEntries.map(e=><li key={e.id}><div className="timeline-top"><b>{e.name}</b><span className="pips" title={`${e.hours} h`}>{pips(e.hours)}</span></div><p>{e.reflection||'—'}</p><small>This term {e.owner==='you'&&<button className="icon-btn" title="Edit" onClick={()=>openDrawer(e)}>✎</button>}</small></li>)}</ul> : <p className="muted">Nothing logged yet.</p>}
    </section>}
   </section>
  ) : <>
   <header className="welcome"><div><h1>Hi there 👋</h1><p>Here is what is happening across the community service programs.</p></div><div className="welcome-actions"><button className="danger-solid" onClick={resetAll}>Reset data</button><button className="primary" onClick={()=>openDrawer(null)}>+ Log hours</button></div></header>
   {toast&&<div className="toast" role="status"><span>{toast}</span><button onClick={()=>setToast('')}>×</button></div>}
   <section className="kpis"><Kpi label="Entries" value={entries.length} hint="all time"/><Kpi label="Avg / entry" value={meanHours(entries)} hint="hours"/><Kpi label="Programs" value={programsLogged.length} hint="with activity"/></section>
   <div className="dash-grid">
    <section className="card chart"><div className="card-head"><h2>Effort spread</h2><span className="muted">Entries per level</span></div><div className="chart-body"><div className="ring"><div><b>{meanHours(entries)}</b><small>mean</small></div></div><div className="columns">{spread.map(s=><div className="column" key={s.h} title={`${s.count}`}><div className="column-track"><i style={{height:`${s.count/peak*100}%`}}/></div><small>{s.h}</small></div>)}</div></div></section>
    <section className="card lookup"><div className="card-head"><h2>Program check</h2><div className="kebab"><button aria-label="More" onClick={()=>setMenuOpen(o=>!o)}>⋯</button>{menuOpen&&<div className="kebab-menu">{lookup.trim()?<button onClick={()=>openProgram(lookup.trim().toUpperCase())}>Open program page</button>:<span>No program</span>}</div>}</div></div><input className="lookup-input" value={lookup} onChange={e=>setLookup(e.target.value)} placeholder="Code"/><div className="lookup-result"><div><b>{meanHours(looked)}</b><span>avg</span></div><div><b>{looked.length}</b><span>entries</span></div><div><b>{sumHours(looked)}</b><span>total</span></div></div><p className="muted">Values refresh automatically.</p></section>
   </div>
   <section className="card entries" id="entries"><div className="card-head"><h2>Activity feed</h2><span className="muted">{shown.length}/{entries.length}</span></div>
    <div className="filters"><input className="filter-search" value={query} onChange={e=>setQuery(e.target.value)} aria-label="Search entries" placeholder="Type to filter…"/><select value={effort} onChange={e=>setEffort(e.target.value)} aria-label="Effort"><option value="all">Any effort</option>{[1,2,3,4,5,6,7,8].map(h=><option key={h} value={h}>Level {h}</option>)}</select><button className="ghost" onClick={()=>{setToast('List refreshed.');setView('Entries');}}>Refresh</button></div>
    <div className="entry-grid">{shown.map(e=><article className="entry-card" key={e.id}><div className="entry-top"><span className="code-pill" title={getProgram(e.programCode).name} onClick={()=>openProgram(e.programCode)}>{e.programCode}</span><span className="pips">{pips(e.hours)}</span></div><p className="entry-note">{e.reflection||'—'}</p><footer><span>{e.name} · This term</span>{e.owner==='you'&&<button className="icon-btn" title="Edit" onClick={()=>openDrawer(e)}>✎</button>}</footer></article>)}</div>
    {shown.length===0&&<p className="empty">Nothing here.</p>}
   </section>
  </>}
  </main>
  {drawer&&<div className="scrim" onMouseDown={e=>e.target===e.currentTarget&&setDrawer(null)}><aside className="drawer" role="dialog" aria-modal="true" aria-label="Log hours"><div className="drawer-head"><h2>{drawer.id?'Edit entry':'New entry'}</h2><button onClick={()=>setDrawer(null)} aria-label="Close">×</button></div><form onSubmit={save}><label>Program<input value={drawer.programCode} onChange={e=>setDrawer(d=>({...d,programCode:e.target.value}))} placeholder="ENV110"/></label><label>Hours<input value={drawer.hours} onChange={e=>setDrawer(d=>({...d,hours:e.target.value}))} placeholder="0"/></label><label>Reflection<textarea value={drawer.reflection} rows={6} onChange={e=>setDrawer(d=>({...d,reflection:e.target.value}))} placeholder="…"/></label>{problem&&<div className="problem" role="alert">{problem}</div>}<div className="drawer-actions"><button type="submit" className="primary">Save</button><button type="button" className="link-btn" onClick={()=>setDrawer(null)}>Discard</button></div></form></aside></div>}
 </div>;
}
