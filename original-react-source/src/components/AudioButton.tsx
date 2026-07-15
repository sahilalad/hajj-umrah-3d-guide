import { Pause, Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useApp } from './AppContext';

export function AudioButton({text,lang,label}:{text:string;lang:'en'|'gu'|'ar';label?:string}) {
  const [speaking,setSpeaking] = useState(false);
  const {state} = useApp();
  useEffect(()=>()=>speechSynthesis.cancel(),[]);
  const toggle = () => {
    if (speaking) { speechSynthesis.cancel(); setSpeaking(false); return; }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang==='gu' ? 'gu-IN' : lang==='ar' ? 'ar-SA' : 'en-US';
    utterance.rate = state.audioRate;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    speechSynthesis.speak(utterance);
    setSpeaking(true);
  };
  return <button className="audio-button" onClick={toggle} title={label ?? 'Listen'}>
    {speaking?<Pause size={17}/>:<Volume2 size={17}/>}<span>{label ?? (speaking?'Pause':'Listen')}</span>
  </button>;
}
