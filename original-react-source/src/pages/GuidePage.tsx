import { ArrowRight, BookOpen, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../components/AppContext';
import { categories, chapters } from '../data/chapters';

export function GuidePage(){
  const {state}=useApp(); const l=state.language; const [query,setQuery]=useState(''); const [category,setCategory]=useState('all');
  const filtered=useMemo(()=>chapters.filter(c=>(category==='all'||c.category===category)&&(`${c.title.en} ${c.title.gu} ${c.number}`).toLowerCase().includes(query.toLowerCase())),[query,category]);
  return <div className="page guide-page"><div className="page-heading"><span className="eyebrow">{l==='en'?'COMPLETE BOOK MAP':'સંપૂર્ણ પુસ્તક નકશો'}</span><h1>{l==='en'?'Every topic from the uploaded guide':'અપલોડ કરેલ માર્ગદર્શિકાનો દરેક વિષય'}</h1><p>{l==='en'?'All chapters are mapped to their original Gujarati book pages. Open any chapter to read the bilingual layer, save notes and view the scanned source page.':'બધા અધ્યાય મૂળ ગુજરાતી પુસ્તકના પૃષ્ઠો સાથે નકશાંકિત છે. દ્વિભાષી સ્તર, નોંધો અને સ્કેન કરેલ સ્ત્રોત પૃષ્ઠ માટે કોઈપણ અધ્યાય ખોલો.'}</p></div>
    <div className="guide-controls"><label><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={l==='en'?'Search chapters…':'અધ્યાય શોધો…'}/></label><div className="chip-row">{categories.map(c=><button key={c.id} className={category===c.id?'active':''} onClick={()=>setCategory(c.id)}>{c.label[l]}</button>)}</div></div>
    <div className="chapter-grid">{filtered.map(ch=><Link to={`/guide/${ch.id}`} className="chapter-card" key={ch.id}><div className="chapter-number">{ch.number}</div><div><span>{l==='en'?`Book page ${ch.bookPage}`:`પુસ્તક પૃષ્ઠ ${ch.bookPage}`}</span><h2>{ch.title[l]}</h2>{ch.subtopics&&<small>{ch.subtopics.length} {l==='en'?'subtopics':'ઉપવિષયો'}</small>}</div><ArrowRight/></Link>)}</div>
    <Link to="/source-book" className="source-banner"><BookOpen/><div><strong>{l==='en'?'Open the complete original scanned book':'સંપૂર્ણ મૂળ સ્કેન કરેલ પુસ્તક ખોલો'}</strong><span>{l==='en'?'The original PDF remains available inside the project as the primary source.':'મૂળ PDF પ્રોજેક્ટમાં મુખ્ય સ્ત્રોત તરીકે ઉપલબ્ધ રહે છે.'}</span></div><ArrowRight/></Link>
  </div>
}
