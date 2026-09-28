const KEY='itb_tasks';
const TYPES={test:'Тест',multi:'Множественный выбор',match:'Сопоставление',order:'Последовательность',categorize:'Распределение',fill:'Заполнение пропусков',error:'Найди ошибку',sort:'Сортировка'};
const LV=['Лёгкая','Средняя','Сложная'];
// [подсказка по формату, пример]
const F={
test:['Вопросы через пустую строку. 1-я строка — вопрос, далее варианты; правильный начинается с +','Какой метод добавляет элемент в конец массива?\npop()\n+push()\nshift()\nslice()'],
multi:['Как в тесте, но знаком + можно отметить несколько вариантов','Выберите типы данных JavaScript\n+String\n+Number\n+Boolean\nHTML'],
match:['Одна пара на строку: левая часть — правая часть','HTML — Структура страницы\nCSS — Оформление\nJavaScript — Интерактивность\nSQL — Работа с данными'],
order:['Элементы по одному в строке в ПРАВИЛЬНОМ порядке','Анализ задачи\nПроектирование\nРазработка\nТестирование\nПубликация'],
categorize:['Категория: элемент1, элемент2','Frontend: HTML, CSS, JavaScript\nBackend: Node.js, PHP, Express'],
fill:['Одна фраза на строку; пропуск — ____ ; после | допустимые ответы через запятую','Для объявления переменной используют ключевое слово ____ | let, const, var'],
error:['Код построчно; ниже укажите номер строки с ошибкой и пояснение','const numbers = [1, 2, 3];\nnumbers.push(4);\nconsole.log(number);'],
sort:['Категория: элемент1, элемент2','String: Hello, 2026\nNumber: 25, 3.14\nBoolean: true, false']};
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const sample=(a,n)=>shuffle(a).slice(0,n);
const save=t=>localStorage.setItem(KEY,JSON.stringify(t));
function load(){let t;try{t=JSON.parse(localStorage.getItem(KEY))}catch(e){}
 if(!t){t=Object.keys(F).map((k,i)=>({id:i+1,title:TYPES[k]+': пример',type:k,level:LV[i%3],instruction:'Выполните задание и нажмите «Проверить».',text:F[k][1],bad:3,expl:'Используется number вместо numbers.'}));save(t)}
 return t}
function parse(t){const L=t.text.split('\n').map(s=>s.trim()).filter(Boolean);
 switch(t.type){
 case'test':case'multi':return{qs:t.text.trim().split(/\n\s*\n/).map(b=>{const l=b.split('\n').map(s=>s.trim()).filter(Boolean),o=l.slice(1);return{q:l[0],opts:o.map(s=>s.replace(/^\+\s*/,'')),ok:o.map((s,i)=>s[0]==='+'?i:-1).filter(i=>i>=0)}})};
 case'match':return{pairs:L.map(s=>s.split(/\s*[—–]\s*|\s-\s/)).filter(p=>p.length>1)};
 case'order':return{items:L};
 case'fill':return{qs:L.map(s=>{const[q,a]=s.split('|');return{q:q.trim(),a:(a||'').split(',').map(x=>x.trim())}})};
 case'error':return{lines:t.text.trim().split('\n'),bad:(+t.bad||1)-1,expl:t.expl||''};
 default:return{cats:L.map(s=>{const[n,r]=s.split(':');return{name:n.trim(),items:(r||'').split(',').map(x=>x.trim()).filter(Boolean)}})}}}
const size=t=>{const d=parse(t);return(d.qs||d.pairs||d.items||d.lines||d.cats.flatMap(c=>c.items)).length};
