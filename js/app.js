const $=s=>document.querySelector(s);
let tasks=load();
$('#ty').append(...Object.entries(TYPES).map(([k,v])=>new Option(v,k)));
$('#lv').append(...LV.map(v=>new Option(v,v)));
function draw(){const q=$('#q').value.toLowerCase(),ty=$('#ty').value,lv=$('#lv').value,mine=location.hash==='#mine',box=$('#cards');
 $('#head').textContent=mine?'Мои задания':'Все задания';box.innerHTML='';
 tasks.filter(t=>(!mine||t.mine)&&t.title.toLowerCase().includes(q)&&(!ty||t.type===ty)&&(!lv||t.level===lv)).forEach(t=>{
  const c=el('div','card'),b=el('button','','Начать');c.append(el('h3','',t.title),el('p','',`${TYPES[t.type]} · ${t.level} · элементов: ${size(t)}`),b);
  b.onclick=()=>start([t]);
  if(t.mine){const d=el('button','','Удалить');d.onclick=()=>{tasks=tasks.filter(x=>x!==t);save(tasks);draw()};c.append(d)}
  box.append(c)})}
function start(list){$('#list').hidden=true;$('#player').hidden=false;play($('#play'),list)}
$('#mix').onclick=()=>start(shuffle(tasks).slice(0,3));
$('#back').onclick=()=>location.reload();
['#q','#ty','#lv'].forEach(s=>$(s).addEventListener('input',draw));
addEventListener('hashchange',draw);draw();
