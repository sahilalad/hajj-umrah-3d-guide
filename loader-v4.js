const parts=await Promise.all(Array.from({length:8},(_,i)=>fetch(`./chunks/v4-${String(i).padStart(2,'0')}.b64?v=4`).then(r=>{if(!r.ok)throw new Error(`Chunk ${i} failed`);return r.text()})));
const binary=atob(parts.join('').replace(/\s/g,''));
const bytes=new Uint8Array(binary.length);
for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
const url=URL.createObjectURL(new Blob([bytes],{type:'text/javascript'}));
try{await import(url)}finally{setTimeout(()=>URL.revokeObjectURL(url),10000)}
