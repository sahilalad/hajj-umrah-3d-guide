import { BookOpen, Compass, Download, Heart, Home, Menu, MoonStar, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LanguageSwitch } from './LanguageSwitch';
import { useApp } from './AppContext';

const nav=[
  {to:'/',icon:Home,en:'Home',gu:'હોમ'},
  {to:'/journey/umrah',icon:Compass,en:'Umrah Journey',gu:'ઉમરા સફર'},
  {to:'/journey/hajj',icon:Sparkles,en:'Hajj Journey',gu:'હજ સફર'},
  {to:'/guide',icon:BookOpen,en:'Complete Guide',gu:'સંપૂર્ણ માર્ગદર્શિકા'},
  {to:'/duas',icon:Heart,en:'Duas',gu:'દુઆઓ'},
  {to:'/tools',icon:Download,en:'My Data',gu:'મારો ડેટા'}
];

export function Layout(){
  const [open,setOpen]=useState(false); const {state}=useApp();
  return <div className="app-shell" style={{'--font-scale':state.fontScale} as React.CSSProperties}>
    <header className="topbar">
      <NavLink to="/" className="brand"><span className="brand-mark"><MoonStar size={22}/></span><span><strong>Manasik 3D</strong><small>{state.language==='en'?'Hajj & Umrah Guide':'હજ અને ઉમરા માર્ગદર્શિકા'}</small></span></NavLink>
      <div className="topbar-actions"><LanguageSwitch/><button className="menu-button" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>
    </header>
    <aside className={open?'sidebar open':'sidebar'}>
      <nav>{nav.map(item=>{const I=item.icon;return <NavLink key={item.to} to={item.to} onClick={()=>setOpen(false)} className={({isActive})=>isActive?'active':''}><I size={20}/><span>{state.language==='en'?item.en:item.gu}</span></NavLink>})}</nav>
      <div className="source-note"><strong>{state.language==='en'?'Source-led content':'સ્ત્રોત આધારિત સામગ્રી'}</strong><span>{state.language==='en'?'Built around the uploaded Gujarati guide.':'અપલોડ કરેલ ગુજરાતી માર્ગદર્શિકા આધારિત.'}</span></div>
    </aside>
    <main className="main-content"><Outlet/></main>
  </div>
}
