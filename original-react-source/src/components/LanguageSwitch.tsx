import { Languages } from 'lucide-react';
import { useApp } from './AppContext';

export function LanguageSwitch() {
  const {state,setLanguage} = useApp();
  return <div className="language-switch" aria-label="Language">
    <Languages size={17}/>
    <button className={state.language==='en'?'active':''} onClick={()=>setLanguage('en')}>English</button>
    <button className={state.language==='gu'?'active':''} onClick={()=>setLanguage('gu')}>ગુજરાતી</button>
  </div>;
}
