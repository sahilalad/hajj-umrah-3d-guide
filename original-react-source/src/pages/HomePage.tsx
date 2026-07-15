import { ArrowRight, BookMarked, CheckCircle2, Compass, Headphones, Languages, Map, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { KaabaScene } from '../components/KaabaScene';
import { ProgressRing } from '../components/ProgressRing';
import { useApp } from '../components/AppContext';
import { hajjSteps, umrahSteps } from '../data/journeys';

export function HomePage(){
  const {state}=useApp(); const l=state.language;
  const total=hajjSteps.length+umrahSteps.length;
  const complete=state.completedSteps.filter(x=>hajjSteps.some(s=>s.id===x)||umrahSteps.some(s=>s.id===x)).length;
  const progress=total?complete/total*100:0;
  return <div className="page home-page">
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">{l==='en'?'ENGLISH • ગુજરાતી • ARABIC DUAS':'ગુજરાતી • ENGLISH • અરબી દુઆઓ'}</span>
        <h1>{l==='en'?'Learn Hajj and Umrah through an interactive 3D journey':'ઇન્ટરેક્ટિવ 3D સફર દ્વારા હજ અને ઉમરા શીખો'}</h1>
        <p>{l==='en'?'A respectful, step-by-step learning experience based on the uploaded Gujarati Hajj and Umrah guide, with local progress, notes, bookmarks and spoken explanations.':'અપલોડ કરેલ ગુજરાતી હજ અને ઉમરા માર્ગદર્શિકા આધારિત આદરપૂર્ણ, પગલું-દર-પગલું અનુભવ - લોકલ પ્રગતિ, નોંધો, બુકમાર્ક અને બોલીને સમજાવવાની સુવિધા સાથે.'}</p>
        <div className="hero-actions"><Link className="primary-button" to="/journey/umrah">{l==='en'?'Begin Umrah':'ઉમરા શરૂ કરો'}<ArrowRight size={18}/></Link><Link className="secondary-button" to="/journey/hajj">{l==='en'?'Explore Hajj':'હજ જુઓ'}</Link></div>
        <div className="hero-stats"><ProgressRing value={progress} label={l==='en'?'journey':'સફર'}/><div><strong>{state.bookmarks.length}</strong><span>{l==='en'?'bookmarks':'બુકમાર્ક'}</span></div><div><strong>{state.favoriteDuas.length}</strong><span>{l==='en'?'saved duas':'સાચવેલી દુઆઓ'}</span></div></div>
      </div>
      <KaabaScene/>
    </section>

    <section className="quick-grid">
      <Link to="/journey/umrah" className="quick-card"><Compass/><span><strong>{l==='en'?'Guided Umrah':'માર્ગદર્શિત ઉમરા'}</strong><small>{l==='en'?'Eight interactive stages':'આઠ ઇન્ટરેક્ટિવ પગલાં'}</small></span><ArrowRight/></Link>
      <Link to="/journey/hajj" className="quick-card"><Map/><span><strong>{l==='en'?'Day-by-day Hajj':'દિવસ મુજબ હજ'}</strong><small>{l==='en'?'Mina, Arafah, Muzdalifah and more':'મીના, અરફાત, મુઝદલિફા અને વધુ'}</small></span><ArrowRight/></Link>
      <Link to="/guide" className="quick-card"><BookMarked/><span><strong>{l==='en'?'Complete book index':'સંપૂર્ણ પુસ્તક સૂચિ'}</strong><small>{l==='en'?'Every chapter mapped':'દરેક અધ્યાય નકશાંકિત'}</small></span><ArrowRight/></Link>
    </section>

    <section className="section-block"><div className="section-heading"><span className="eyebrow">{l==='en'?'DESIGNED FOR PILGRIMS':'હજ યાત્રીઓ માટે રચાયેલ'}</span><h2>{l==='en'?'Useful before, during and after the journey':'સફર પહેલાં, દરમિયાન અને પછી ઉપયોગી'}</h2></div>
      <div className="feature-grid">
        <article><Languages/><h3>{l==='en'?'English and Gujarati':'અંગ્રેજી અને ગુજરાતી'}</h3><p>{l==='en'?'Switch language without leaving the page. Arabic duas remain in Arabic.':'પેજ છોડ્યા વિના ભાષા બદલો. અરબી દુઆઓ અરબીમાં જ રહે છે.'}</p></article>
        <article><Headphones/><h3>{l==='en'?'Spoken explanations':'બોલીને સમજાવવું'}</h3><p>{l==='en'?'Use your device’s speech voices for English, Gujarati and Arabic reading.':'અંગ્રેજી, ગુજરાતી અને અરબી વાંચન માટે તમારા ડિવાઇસની સ્પીચ વોઇસનો ઉપયોગ કરો.'}</p></article>
        <article><WifiOff/><h3>{l==='en'?'Offline-ready shell':'ઓફલાઇન માટે તૈયાર'}</h3><p>{l==='en'?'The PWA shell and visited content are cached. The large source PDF is loaded on demand.':'PWA શેલ અને મુલાકાત લીધેલી સામગ્રી કેશ થાય છે. મોટું સ્ત્રોત PDF જરૂર પડે ત્યારે લોડ થાય છે.'}</p></article>
        <article><CheckCircle2/><h3>{l==='en'?'No account required':'એકાઉન્ટ જરૂરી નથી'}</h3><p>{l==='en'?'Progress, notes and favourites stay on your device and can be exported.':'પ્રગતિ, નોંધો અને મનપસંદ વસ્તુઓ તમારા ડિવાઇસમાં રહે છે અને એક્સપોર્ટ કરી શકાય છે.'}</p></article>
      </div>
    </section>
  </div>
}
