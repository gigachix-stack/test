const $=s=>document.querySelector(s);
$('#type').append(...Object.entries(TYPES).map(([k,v])=>new Option(v,k)));
$('#level').append(...LV.map(v=>new Option(v,v)));
function sync(){const t=$('#type').value;$('#hint').textContent=F[t][0];$('#text').value=F[t][1];
 $('#extra').hidden=t!=='error';$('#cnt').hidden=!['test','multi','fill'].includes(t)}
const get=()=>({id:Date.now(),title:$('#title').value.trim(),type:$('#type').value,level:$('#level').value,instruction:$('#instr').value,text:$('#text').value,count:$('#count').value,bad:$('#bad').value,expl:$('#expl').value,mine:true});
function valid(t){if(!t.title){alert('Введите название');return false}
 try{if(size(t)<1)throw 0}catch(e){alert('Заполните содержимое по подсказке');return false}return true}
$('#type').onchange=sync;
$('#toPrev').onclick=()=>{const t=get();if(!valid(t))return;$('#editor').hidden=true;$('#preview').hidden=false;play($('#pv'),[t])};
$('#toEdit').onclick=()=>{$('#editor').hidden=false;$('#preview').hidden=true};
$('#save').onclick=()=>{const t=get();if(!valid(t))return;const all=load();all.push(t);save(all);location.href='index.html#mine'};
sync();
