import { Bookmark, Check, ChevronLeft, ChevronRight, Circle, ExternalLink, MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../components/AppContext';
import { AudioButton } from '../components/AudioButton';
import { JourneyVisual } from '../components/JourneyVisual';
import { hajjSteps, umrahSteps } from '../data/journeys';
import { duas } from '../data/duas';

export function JourneyPage(){
  const {type}=useParams(); const isHajj=type==='hajj'; const steps=isHajj?hajjSteps:umrahSteps;
  const {state,toggleCompleted,toggleBookmark,setNote}=useApp(); const l=state.language;
  const [selected,setSelected]=useState(()=>Math.max(0,steps.findIndex(s=>!state.completedSteps.includes(s.id))));
  const step=steps[selected];
  const relevantDuas=useMemo(()=>duas.filter(d=>step.duaIds?.includes(d.id)),[step]);
  const paragraph=[step.description[l],...step.instructions.map(i=>i[l])].join(' ');
  const completed=state.completedSteps.filter(id=>steps.some(s=>s.id===id)).length;
  return <div className="page journey-page">
    <div className="journey-header"><div><span className="eyebrow">{isHajj?(l==='en'?'HAJJ JOURNEY':'હજ સફર'):(l==='en'?'UMRAH JOURNEY':'ઉમરા સફર')}</span><h1>{isHajj?(l==='en'?'Day-by-day Hajj guide':'દિવસ મુજબ હજ માર્ગદર્શન'):(l==='en'?'Step-by-step Umrah guide':'પગલું-દર-પગલું ઉમરા માર્ગદર્શન')}</h1><p>{l==='en'?`${completed} of ${steps.length} stages completed`:`${steps.length} માંથી ${completed} પગલાં પૂર્ણ`}</p></div><div className="journey-progress"><div style={{width:`${completed/steps.length*100}%`}}/></div></div>
    <div className="journey-layout">
      <aside className="step-list">{steps.map((s,i)=><button key={s.id} onClick={()=>setSelected(i)} className={`${i===selected?'active':''} ${state.completedSteps.includes(s.id)?'done':''}`}><span>{state.completedSteps.includes(s.id)?<Check size={16}/>:<Circle size={14}/>}</span><div><small>{l==='en'?`Step ${s.order}`:`પગલું ${s.order}`}</small><strong>{s.title[l]}</strong></div></button>)}</aside>
      <section className="step-detail">
        <JourneyVisual step={step}/>
        <div className="step-toolbar"><span><MapPin size={17}/>{step.place[l]}</span><div><AudioButton text={paragraph} lang={l} label={l==='en'?'Listen':'સાંભળો'}/><button className={state.bookmarks.includes(step.id)?'icon-button active':'icon-button'} onClick={()=>toggleBookmark(step.id)} title="Bookmark"><Bookmark size={18}/></button></div></div>
        <span className="eyebrow">{l==='en'?`STEP ${step.order}`:`પગલું ${step.order}`}</span><h2>{step.title[l]}</h2><p className="lead">{step.description[l]}</p>
        <div className="instruction-list">{step.instructions.map((item,i)=><div key={i}><span>{i+1}</span><p>{item[l]}</p></div>)}</div>
        {relevantDuas.length>0&&<div className="linked-duas"><h3>{l==='en'?'Relevant dua':'સંબંધિત દુઆ'}</h3>{relevantDuas.map(d=><Link key={d.id} to={`/duas#${d.id}`}><span className="arabic-mini">{d.arabic}</span><span>{d.title[l]}</span><ExternalLink size={15}/></Link>)}</div>}
        {step.chapterIds&&<div className="linked-chapters"><h3>{l==='en'?'Read the full ruling in the guide':'માર્ગદર્શિકામાં સંપૂર્ણ મસઅલો વાંચો'}</h3>{step.chapterIds.map(id=><Link key={id} to={`/guide/${id}`}>{l==='en'?'Open chapter':'અધ્યાય ખોલો'} <ExternalLink size={14}/></Link>)}</div>}
        <div className="notes-box"><label>{l==='en'?'My private note':'મારી ખાનગી નોંધ'}</label><textarea value={state.notes[step.id]??''} onChange={e=>setNote(step.id,e.target.value)} placeholder={l==='en'?'Saved only on this device…':'ફક્ત આ ડિવાઇસમાં સાચવાશે…'}/></div>
        <div className="step-actions"><button className="secondary-button" disabled={selected===0} onClick={()=>setSelected(x=>Math.max(0,x-1))}><ChevronLeft size={18}/>{l==='en'?'Previous':'પાછળ'}</button><button className={state.completedSteps.includes(step.id)?'complete-button completed':'complete-button'} onClick={()=>toggleCompleted(step.id)}><Check size={18}/>{state.completedSteps.includes(step.id)?(l==='en'?'Completed':'પૂર્ણ'):(l==='en'?'Mark complete':'પૂર્ણ તરીકે ચિહ્નિત કરો')}</button><button className="primary-button" disabled={selected===steps.length-1} onClick={()=>setSelected(x=>Math.min(steps.length-1,x+1))}>{l==='en'?'Next':'આગળ'}<ChevronRight size={18}/></button></div>
      </section>
    </div>
  </div>
}
