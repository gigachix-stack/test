function el(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
const norm=s=>s.trim().toLowerCase();
function mark(e,g,fb){e.classList.remove('ok','bad');e.classList.add(g?'ok':'bad');e.title=g?'':fb;
 if(e.matches('.q,.row')){let f=e.querySelector('.fb');if(!f)f=e.appendChild(el('div','fb'));f.textContent=g?'':fb}}
let drag;
document.addEventListener('dragstart',e=>{drag=e.target.closest('.chip')});
function dnd(zone,reorder){
 zone.addEventListener('dragover',e=>{e.preventDefault();if(!reorder||!drag)return;const t=e.target.closest('.chip');
  if(t&&t!==drag&&t.parentNode===zone){const r=t.getBoundingClientRect();zone.insertBefore(drag,e.clientY>r.top+r.height/2?t.nextSibling:t)}});
 zone.addEventListener('drop',e=>{e.preventDefault();if(!reorder&&drag)zone.append(drag)})}
function chip(text,cat){const c=el('div','chip',text);c.draggable=true;c.dataset.v=text;if(cat)c.dataset.cat=cat;return c}
const R={};
R.choice=(d,box,t)=>{const single=t.type==='test',qs=sample(d.qs,+t.count||d.qs.length);
 const cs=qs.map(q=>{const w=el('div','q');w.append(el('b','',q.q));const name='n'+Math.random();
  const ins=shuffle(q.opts.map((o,i)=>i)).map(i=>{const l=el('label'),x=el('input');x.type=single?'radio':'checkbox';x.name=name;x.value=i;l.append(x,' '+q.opts[i]);w.append(el('br'),l);return x});
  box.append(w);
  return()=>{const s=ins.filter(x=>x.checked).map(x=>+x.value),g=s.length===q.ok.length&&s.every(v=>q.ok.includes(v));
   mark(w,g,'Верно: '+q.ok.map(i=>q.opts[i]).join(', '));return g}});
 return()=>({ok:cs.map(f=>f()).filter(Boolean).length,total:qs.length})};
R.match=(d,box)=>{const rights=shuffle(d.pairs.map(p=>p[1]));
 const rows=d.pairs.map(p=>{const r=el('div','row'),s=el('select');r.append(el('span','',p[0]+'  →  '));s.append(new Option('—',''),...rights.map(x=>new Option(x,x)));r.append(s);box.append(r);return[r,s,p[1]]});
 return()=>{let ok=0;rows.forEach(([r,s,a])=>{const g=s.value===a;ok+=g;mark(r,g,'Верно: '+a)});return{ok,total:rows.length}}};
R.order=(d,box)=>{const list=el('div','list');shuffle(d.items).forEach(x=>list.append(chip(x)));dnd(list,true);box.append(list);
 return()=>{let ok=0;[...list.children].forEach((c,i)=>{const g=c.dataset.v===d.items[i];ok+=g;mark(c,g,'Верное место: '+(d.items.indexOf(c.dataset.v)+1))});return{ok,total:d.items.length}}};
R.categorize=R.sort=(d,box)=>{const pool=el('div','list'),all=[];dnd(pool);
 d.cats.forEach(c=>c.items.forEach(i=>all.push([i,c.name])));shuffle(all).forEach(([i,c])=>pool.append(chip(i,c)));box.append(pool);
 const zs=el('div','cats');d.cats.forEach(c=>{const z=el('div','list zone');z.dataset.name=c.name;z.append(el('h4','',c.name));dnd(z);zs.append(z)});box.append(zs);
 return()=>{let ok=0;zs.querySelectorAll('.chip').forEach(c=>{const g=c.dataset.cat===c.parentNode.dataset.name;ok+=g;mark(c,g,'Верно: '+c.dataset.cat)});return{ok,total:all.length}}};
R.fill=(d,box,t)=>{const qs=sample(d.qs,+t.count||d.qs.length);
 const cs=qs.map(q=>{const w=el('div','q'),ins=[];q.q.split('____').forEach((p,i,a)=>{w.append(p);if(i<a.length-1){const x=el('input');ins.push(x);w.append(x)}});box.append(w);
  return()=>{const g=ins.every(x=>q.a.some(a=>norm(a)===norm(x.value)));mark(w,g,'Допустимо: '+q.a.join(', '));return g}});
 return()=>({ok:cs.map(f=>f()).filter(Boolean).length,total:qs.length})};
R.error=(d,box)=>{let sel=-1;const fb=el('div','fb');
 const rows=d.lines.map((l,i)=>{const b=el('div','line',(i+1)+'  '+l);b.onclick=()=>{sel=i;rows.forEach(r=>r.classList.remove('sel'));b.classList.add('sel')};box.append(b);return b});
 box.append(fb);
 return()=>{const g=sel===d.bad;rows.forEach(r=>r.classList.remove('ok','bad'));if(sel>=0)rows[sel].classList.add(g?'ok':'bad');
  fb.textContent=(g?'Верно! ':'Ошибка в строке '+(d.bad+1)+'. ')+d.expl;return{ok:+g,total:1}}};
function play(box,tasks){box.innerHTML='';
 const checks=tasks.map(t=>{const s=el('section','task'),inner=el('div');s.append(el('h3','',t.title),el('p','',t.instruction||''),inner);box.append(s);
  return R[t.type==='test'||t.type==='multi'?'choice':t.type](parse(t),inner,t)});
 const btn=el('button','','Проверить'),bar=el('div','bar'),fill=el('div','fill'),res=el('div');bar.append(fill);box.append(btn,bar,res);
 btn.onclick=()=>{let ok=0,total=0;checks.forEach(c=>{const r=c();ok+=r.ok;total+=r.total});
  const p=total?Math.round(ok/total*100):0;fill.style.width=p+'%';
  res.textContent=`Правильно — ${ok}; Ошибки — ${total-ok}; Результат — ${p}%`}}
