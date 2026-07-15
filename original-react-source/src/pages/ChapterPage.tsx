import { Bookmark, ChevronLeft, ExternalLink, FileText, ShieldCheck } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useApp } from '../components/AppContext';
import { AudioButton } from '../components/AudioButton';
import { chapters } from '../data/chapters';

export function ChapterPage(){
  const {id}=useParams(); const ch=chapters.find(x=>x.id===id); const {state,toggleBookmark,setNote}=useApp(); const l=state.language;
  if(!ch)return <Navigate to="/guide" replace/>;
  const fallbackEn='This chapter is mapped to the original Gujarati source. The full English editorial translation is kept separate from the scanned source so references can be checked before publication. Use the source page viewer below while the verified bilingual transcription is completed.';
  const fallbackGu='આ અધ્યાય મૂળ ગુજરાતી સ્ત્રોત સાથે નકશાંકિત છે. પ્રકાશન પહેલાં રેફરન્સ ચકાસી શકાય તે માટે સંપૂર્ણ અંગ્રેજી સંપાદકીય અનુવાદ સ્કેન કરેલ સ્ત્રોતથી અલગ રાખવામાં આવ્યો છે. ચકાસાયેલ દ્વિભાષી ટ્રાન્સક્રિપ્શન પૂર્ણ થાય ત્યાં સુધી નીચેના સ્ત્રોત પૃષ્ઠનો ઉપયોગ કરો.';
  const summary=ch.summary?.[l]??(l==='en'?fallbackEn:fallbackGu);
  return <div className="page chapter-page"><Link to="/guide" className="back-link"><ChevronLeft/>{l==='en'?'Back to all topics':'બધા વિષયો પર પાછા'}</Link>
    <div className="chapter-hero"><div><span className="eyebrow">{l==='en'?`CHAPTER ${ch.number} • BOOK PAGE ${ch.bookPage}`:`અધ્યાય ${ch.number} • પુસ્તક પૃષ્ઠ ${ch.bookPage}`}</span><h1>{ch.title[l]}</h1><p>{summary}</p><div className="chapter-buttons"><AudioButton text={`${ch.title[l]}. ${summary}`} lang={l} label={l==='en'?'Listen to explanation':'સમજ સાંભળો'}/><button className={state.bookmarks.includes(ch.id)?'secondary-button selected':'secondary-button'} onClick={()=>toggleBookmark(ch.id)}><Bookmark size={18}/>{state.bookmarks.includes(ch.id)?(l==='en'?'Bookmarked':'બુકમાર્ક કરેલ'):(l==='en'?'Bookmark':'બુકમાર્ક')}</button></div></div><div className="verification-card"><ShieldCheck/><strong>{l==='en'?'Editorial verification layer':'સંપાદકીય ચકાસણી સ્તર'}</strong><p>{l==='en'?'The app preserves the book as primary source. Arabic text, Quran references and hadith references should be checked before a chapter is marked publish-ready.':'એપ પુસ્તકને મુખ્ય સ્ત્રોત તરીકે જાળવે છે. અધ્યાયને પ્રકાશન માટે તૈયાર ગણતાં પહેલાં અરબી લખાણ, કુર્આન રેફરન્સ અને હદીસ રેફરન્સ તપાસવાના છે.'}</p></div></div>
    {ch.subtopics&&<section className="subtopic-section"><h2>{l==='en'?'Included subtopics':'સમાવેલ ઉપવિષયો'}</h2>{ch.subtopics.map((s,i)=><div key={i}><span>{i+1}</span><strong>{s.title[l]}</strong><small>{l==='en'?`Page ${s.bookPage}`:`પૃષ્ઠ ${s.bookPage}`}</small></div>)}</section>}
    <section className="source-view-card"><div><FileText/><span><strong>{l==='en'?'Original Gujarati source':'મૂળ ગુજરાતી સ્ત્રોત'}</strong><small>{l==='en'?`Opens near PDF page ${ch.sourcePdfPage}`:`PDF પૃષ્ઠ ${ch.sourcePdfPage} નજીક ખોલે છે`}</small></span></div><a className="primary-button" href={`/source/hajj-umrah-masail-gujarati.pdf#page=${ch.sourcePdfPage}`} target="_blank" rel="noreferrer">{l==='en'?'Open source page':'સ્ત્રોત પૃષ્ઠ ખોલો'}<ExternalLink size={17}/></a></section>
    <div className="notes-box chapter-notes"><label>{l==='en'?'My notes for this chapter':'આ અધ્યાય માટે મારી નોંધો'}</label><textarea value={state.notes[`chapter:${ch.id}`]??''} onChange={e=>setNote(`chapter:${ch.id}`,e.target.value)} placeholder={l==='en'?'These notes stay only on your device…':'આ નોંધો ફક્ત તમારા ડિવાઇસમાં રહેશે…'}/></div>
  </div>
}
