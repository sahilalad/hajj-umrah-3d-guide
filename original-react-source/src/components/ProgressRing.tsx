export function ProgressRing({value,label}:{value:number;label:string}) {
  const radius=38; const circumference=2*Math.PI*radius; const dash=circumference*(1-value/100);
  return <div className="progress-ring" aria-label={`${Math.round(value)}% ${label}`}>
    <svg viewBox="0 0 92 92"><circle className="ring-bg" cx="46" cy="46" r={radius}/><circle className="ring-value" cx="46" cy="46" r={radius} strokeDasharray={circumference} strokeDashoffset={dash}/></svg>
    <div><strong>{Math.round(value)}%</strong><span>{label}</span></div>
  </div>;
}
