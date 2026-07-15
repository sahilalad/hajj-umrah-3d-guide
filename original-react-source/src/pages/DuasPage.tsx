import { CheckCircle2, Heart, Search, ShieldAlert, Volume2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../components/AppContext';
import { AudioButton } from '../components/AudioButton';
import { duaCategories, duas } from '../data/duas';

export function DuasPage(){
  const {state,toggleFavoriteDua}=useApp(); const l=state.language; const [query,setQuery]=useState(''); const [cat,setCat]=useState('all');
  useEffect(()=>{if(location.hash){setTimeout(()=>document.querySelector(location.hash)?.scrollIntoView({behavior:'smooth',block:'center'}),100)}},[]);
  const filtered=useMemo(()=>duas.filter(d=>(cat==='all'||d.category===cat)&&`${d.title.en} ${d.title.gu} ${d.arabic} ${d.transliteration}`.toLowerCase().includes(query.toLowerCase())),[query,cat]);
  return <div className="page duas-page"><div className="page-heading"><span className="eyebrow">{l==='en'?'DUA LIBRARY':'દુઆ લાઇબ્રેરી'}</span><h1>{l==='en'?'Arabic, pronunciation and meaning together':'અરબી, ઉચ્ચાર અને અર્થ એક સાથે'}</h1><p>{l==='en'?'The library is structured for the exact book-based editorial workflow. Entries marked “Review” must not be treated as final until compared with the scanned page and verified references.':'લાઇબ્રેરી પુસ્તક આધારિત સંપાદકીય પ્રક્રિયા માટે રચાયેલ છે. “ચકાસણી” ચિહ્નિત એન્ટ્રીઓને સ્કેન કરેલ પૃષ્ઠ અને રેફરન્સ સાથે સરખામણી પહેલાં અંતિમ ન માનવી.'}</p></div>
    <div className="guide-controls"><label><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={l==='en'?'Search Arabic, title or meaning…':'અરબી, શીર્ષક અથવા અર્થ શોધો…'}/></label><div className="chip-row">{duaCategories.map(c=><button key={c.id} className={cat===c.id?'active':''} onClick={()=>setCat(c.id)}>{c.label[l]}</button>)}</div></div>
    <div className="dua-list">{filtered.map(d=><article id={d.id} className="dua-card" key={d.id}><div className="dua-card-head"><div><span className="eyebrow">{d.category.replace('-',' ')}</span><h2>{d.title[l]}</h2></div><button className={state.favoriteDuas.includes(d.id)?'favorite active':'favorite'} onClick={()=>toggleFavoriteDua(d.id)}><Heart fill={state.favoriteDuas.includes(d.id)?'currentColor':'none'}/></button></div>
      <div className="arabic-text" dir="rtl">{d.arabic}</div><div className="dua-audio-row"><AudioButton text={d.arabic} lang="ar" label={l==='en'?'Arabic audio':'અરબી ઓડિયો'}/><AudioButton text={d.meaning[l]} lang={l} label={l==='en'?'Meaning audio':'અર્થ સાંભળો'}/></div>
      <div className="dua-columns"><div><small>{l==='en'?'Transliteration':'અંગ્રેજી ઉચ્ચાર'}</small><p>{d.transliteration}</p></div><div><small>{l==='en'?'Gujarati pronunciation':'ગુજરાતી ઉચ્ચાર'}</small><p className="gujarati">{d.guPronunciation}</p></div></div>
      <div className="meaning-box"><small>{l==='en'?'Meaning':'અર્થ'}</small><p>{d.meaning[l]}</p></div>
      <div className="source-row"><span className={d.verification==='verified'?'verified':d.verification==='review'?'review':'book-ref'}>{d.verification==='verified'?<CheckCircle2/>:d.verification==='review'?<ShieldAlert/>:<Volume2/>}{d.verification==='verified'?(l==='en'?'Verified':'ચકાસેલ'):d.verification==='review'?(l==='en'?'Editorial review required':'સંપાદકીય ચકાસણી જરૂરી'):(l==='en'?'Book reference recorded':'પુસ્તક રેફરન્સ નોંધાયેલ')}</span><p>{d.source[l]} {d.bookPage&&(l==='en'?`(Book page ${d.bookPage})`:`(પુસ્તક પૃષ્ઠ ${d.bookPage})`)}</p></div>
    </article>)}</div>
  </div>
}
