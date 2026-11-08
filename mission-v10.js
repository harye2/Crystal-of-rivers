/* Arcanis V10 — Misión educativa del Cristal de los Ríos
   Nivel 1 · La ribera limpia: separación de residuos (Resolución 2184 de 2019)
   Nivel 2 · La olla familiar: mercurio en peces, biomagnificación y autocuidado
   Nivel 3 · La ruta del oro verde: alternativas al mercurio y oficios del Bajo Cauca
   Cada nivel sigue la misma estructura: tarjetas para aprender → práctica guiada → juego.
   La ayuda de la práctica se retira poco a poco y vuelve una vez si el jugador repite un error. */
(function(){
'use strict';

/* ---------- utilidades ---------- */
function es(){return lang==='es'}
function tx(o){return o?(o[lang]!=null?o[lang]:o.es):''}
function rnd(a,b){return a+Math.random()*(b-a)}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function el(id){return document.getElementById(id)}
function rm(id){var e=el(id);if(e)e.remove()}
var EMOJI="'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";
var FONT="Inter,system-ui,-apple-system,'Segoe UI',sans-serif";

/* ---------- datos guardados de esta versión ---------- */
var S10={jobs:{},plants:{},pact:[],seen:{},name:''};
function loadS10(){try{var d=JSON.parse(localStorage.getItem('arcanisV10')||'null');if(d&&d.name===S.name){S10=Object.assign({jobs:{},plants:{},pact:[],seen:{}},d);return}}catch(e){}S10={jobs:{},plants:{},pact:[],seen:{},name:S.name}}
function saveS10(){try{S10.name=S.name;localStorage.setItem('arcanisV10',JSON.stringify(S10))}catch(e){}}
function syncS10(){if(S10.name!==S.name)loadS10()}

/* ---------- dificultad ---------- */
var DV={
  easy:  {sp:.85,lives:4,g1:16,t1:100,g2:10,t2:90,g3:650, t3:150},
  normal:{sp:1,  lives:3,g1:20,t1:95,g2:12,t2:85,g3:800,t3:140},
  hard:  {sp:1.15,lives:3,g1:24,t1:90,g2:15,t2:80,g3:950,t3:130}
};

/* ---------- textos generales ---------- */
Object.assign(T.es,{
  l1title:'La ribera limpia',l1sub:'Separa cada residuo en la caneca correcta.',
  l2title:'La olla familiar',l2sub:'Elige el pescado con menos mercurio para cada persona.',
  l3title:'La ruta del oro verde',l3sub:'Recoge plantas que reemplazan el azogue y decide bien.',
  worldSub:'Aprende, practica y juega: cada mundo te enseña una acción real para proteger el río Cauca.',
  brief1:'La basura de las casas llega a la ribera. Cuando llueve, el agua la arrastra hasta el río. Aprende el código de colores y atrapa cada residuo con la caneca correcta.',
  brief2:'El mercurio de la minería entra al agua y se acumula en los peces. Aprende cuáles tienen menos riesgo y elige bien para cada persona de la familia.',
  brief3:'Cruza el puente sobre el Cauca: recoge plantas que pueden reemplazar el azogue y elige el mejor camino en cada letrero.',
  lesson1:'Separar en blanca, verde y negra —y llevar pilas y celulares al punto posconsumo— evita que la basura llegue al río.',
  lesson2:'Prefiere bocachico y vizcaína: los peces que comen otros peces acumulan más mercurio. Pregunta siempre dónde lo pescaron.',
  lesson3:'Sí hay formas de separar el oro sin mercurio, y oficios que pueden reemplazar la minería en el Bajo Cauca.',
  launch:'¡APRENDER Y JUGAR!',
  certBody:'por superar los tres desafíos, sellar el Pacto del Guardián y comprometerse con la protección de los ríos Cauca y Nechí y de las comunidades de Caucasia.'
});
Object.assign(T.en,{
  l1title:'The clean riverbank',l1sub:'Put each piece of waste in the right bin.',
  l2title:'The family pot',l2sub:'Choose fish with less mercury for each person.',
  l3title:'The green gold route',l3sub:'Collect plants that replace mercury and decide well.',
  worldSub:'Learn, practice, and play: every world teaches you a real action to protect the Cauca River.',
  brief1:'Trash from homes ends up on the riverbank. When it rains, the water carries it into the river. Learn the color code and catch each piece of waste with the right bin.',
  brief2:'Mercury from mining gets into the water and builds up in fish. Learn which fish are less risky and choose well for each person in the family.',
  brief3:'Cross the bridge over the Cauca: collect plants that can replace mercury and choose the best path at every sign.',
  lesson1:'Sorting waste into white, green, and black bins —and taking batteries and phones to a drop-off point— keeps trash out of the river.',
  lesson2:'Choose bocachico and vizcaína: fish that eat other fish build up more mercury. Always ask where the fish was caught.',
  lesson3:'There are ways to separate gold without mercury, and there are jobs that can replace mining in the Bajo Cauca.',
  launch:'LEARN AND PLAY!',
  certBody:'for completing all three challenges, sealing the Guardian’s Pact, and promising to protect the Cauca and Nechí rivers and the communities of Caucasia.'
});
L[1].rules=[['♻️','Separa por colores / Sort by color'],['🔋','Pilas al posconsumo / Batteries to drop-off'],['💧','Nada al río / Nothing in the river']];
L[2].rules=[['🟢','Peces de menor riesgo / Lower-risk fish'],['📍','Evita la zona de la draga / Avoid the dredge zone'],['👁️','Visión de Kael: 2 usos / Kael\u2019s Vision: 2 uses']];
L[3].rules=[['🌿','Recoge plantas / Collect plants'],['🪧','Decide bien / Decide well'],['⬆️','Salta y esquiva / Jump and dodge']];

if(typeof D!=='undefined'){
  D.es.intro=function(n){return '¡Hola, '+n+'! Soy tu avatar. Kael, el Guardián de la Sostenibilidad de Arcanis, vino a Caucasia a ayudarnos. Aquí no hay magia oscura: el río se contamina por la basura, las aguas residuales sin tratar y el mercurio de la minería de oro. Aprenderemos acciones reales para protegerlo.'};
  D.en.intro=function(n){return 'Hello, '+n+'! I am your avatar. Kael, the Guardian of Sustainability from Arcanis, came to Caucasia to help us. There is no dark magic here: the river is polluted by trash, untreated wastewater, and mercury from gold mining. We will learn real actions to protect it.'};
  D.es.before1=function(n){return n+', antes de limpiar la ribera, Kael nos enseñará a separar los residuos. Primero practicaremos con ayuda.'};
  D.en.before1=function(n){return n+', before we clean the riverbank, Kael will teach us how to sort waste. First, we will practice with help.'};
  D.es.before2=function(n){return n+', el mercurio que usa la minería de oro llega al río y se acumula en los peces. Aprenderemos qué peces tienen menos riesgo y para quién.'};
  D.en.before2=function(n){return n+', the mercury used in gold mining gets into the river and builds up in fish. We will learn which fish are less risky, and for whom.'};
  D.es.before3=function(n){return n+', es hora de recorrer la ruta del oro verde: plantas que reemplazan el azogue y oficios que reemplazan la minería.'};
  D.en.before3=function(n){return n+', it is time to travel the green gold route: plants that replace mercury and jobs that replace mining.'};
  D.es.level1=function(n){return '¡Excelente, '+n+'! Separamos bien los residuos y el río respira mejor. Blanca, verde, negra y punto posconsumo: ¡no lo olvides en casa!'};
  D.en.level1=function(n){return 'Excellent, '+n+'! We sorted the waste and the river can breathe again. White, green, black, and drop-off point: remember it at home!'};
  D.es.level2=function(n){return n+', ahora sabes elegir: los peces que comen otros peces acumulan más mercurio. Cuéntaselo a tu familia.'};
  D.en.level2=function(n){return n+', now you know how to choose: fish that eat other fish have more mercury. Tell your family.'};
  D.es.level3=function(n){return '¡Lo logramos, '+n+'! Descubrimos que hay caminos sin azogue y nuevos oficios para el Bajo Cauca.'};
  D.en.level3=function(n){return 'We did it, '+n+'! We discovered ways to work without mercury and new jobs for the Bajo Cauca.'};
  D.es.final=function(n){return '¡Lo conseguimos, '+n+'! Sellaste el Pacto del Guardián. Ahora cumple tus compromisos en la vida real.'};
  D.en.final=function(n){return 'We did it, '+n+'! You sealed the Guardian’s Pact. Now keep your promises in real life.'};
}

/* Textos de la pantalla de impacto (se conservan las imágenes de la estudiante) */
IMPACT[1].es.action='Separa en casa: blanca para aprovechables, verde para orgánicos y negra para no aprovechables. Lleva pilas y celulares a un punto posconsumo.';
IMPACT[1].en.action='Sort your waste at home: white for recyclables, green for organic waste, and black for non-recyclables. Take batteries and phones to a drop-off point.';
IMPACT[2].es.action='Prefiere peces que no comen otros peces, pregunta dónde los pescaron y cuida especialmente a embarazadas, madres lactantes y niños.';
IMPACT[2].en.action='Choose fish that do not eat other fish, ask where they were caught, and take special care of pregnant women, breastfeeding mothers, and children.';
IMPACT[3].es.fact='En el Chocó, algunos mineros separan el oro con hojas de balso o malva, y una investigación colombiana de 2024 lo logró con cáscara de cacao.';
IMPACT[3].en.fact='In Chocó, some miners separate gold with balsa or malva leaves, and in 2024 Colombian researchers did it with cocoa husks.';
IMPACT[3].es.action='Cuéntale a tu familia que existen alternativas al azogue y oficios como la apicultura, la piscicultura y el cultivo de cacao.';
IMPACT[3].en.action='Tell your family that there are alternatives to mercury and jobs like beekeeping, fish farming, and growing cocoa.';

/* Insignias */
badges=function(id){id=id||'badgeRow';var names=es()?['Separador experto','Guardián de la olla','Oro verde','Defensor de Caucasia']:['Waste sorter','Guardian of the pot','Green gold','Defender of Caucasia'],ic=['♻️','🍲','🌿','🛡️'];$(id).innerHTML=names.map(function(n,i){return '<div class="badge '+(S.badges.includes(i+1)?'on':'')+'"><span>'+ic[i]+'</span><b>'+n+'</b></div>'}).join('')};

/* Fondos: ribera (v8) para el nivel 1; draga y puente reales de Caucasia (v9) para los niveles 2 y 3 */
var BG={1:'assets/world-1-cauca-2d-v8.webp',2:'assets/caucasia-level-2-dredge-2d-v9.webp',3:'assets/caucasia-level-3-bridge-2d-v9.webp'};
[1,2,3].forEach(function(n){IMG[n].src=BG[n];L[n].bg=BG[n]});

/* Fotogramas del avatar */
var FR={boy:[],girl:[]};
['boy','girl'].forEach(function(g){for(var i=0;i<8;i++){var im=new Image();im.src='assets/avatar-'+g+'-frame-'+i+'.webp';FR[g].push(im)}});
function frame(i){var a=FR[S.gender==='girl'?'girl':'boy'][i];return a&&a.complete&&a.naturalWidth?a:null}

/* ---------- dibujo de fondo tipo "cover" (sin deformar la imagen) ---------- */
var CV={ox:0,oy:0,dw:1,dh:1};
function cvOf(img){var w=C.w,h=C.h;if(!img||!img.complete||!img.naturalWidth){CV={ox:0,oy:0,dw:w,dh:h};return CV}var s=Math.max(w/img.naturalWidth,h/img.naturalHeight),dw=img.naturalWidth*s,dh=img.naturalHeight*s;CV={ox:(w-dw)/2,oy:(h-dh)/2,dw:dw,dh:dh};return CV}
function cover(img){cvOf(img);if(img&&img.complete&&img.naturalWidth)X.drawImage(img,CV.ox,CV.oy,CV.dw,CV.dh);else{X.fillStyle='#062938';X.fillRect(0,0,C.w,C.h)}}
function ip(u,v){return{x:CV.ox+u*CV.dw,y:CV.oy+v*CV.dh}}

function pill(x,y,text,bg,fg,size){X.save();var s=size||11;X.font='800 '+s+'px '+FONT;var w=X.measureText(text).width+16,h=s+10;x=Math.max(w/2+6,Math.min(C.w-w/2-6,x));X.fillStyle=bg||'rgba(2,20,30,.85)';X.beginPath();X.roundRect(x-w/2,y-h/2,w,h,h/2);X.fill();X.fillStyle=fg||'#eaffff';X.textAlign='center';X.textBaseline='middle';X.fillText(text,x,y+.5);X.restore()}
function emoji(ch,x,y,size){X.save();X.font=size+'px '+EMOJI;X.textAlign='center';X.textBaseline='middle';X.fillText(ch,x,y);X.restore()}
function floatTxt(x,y,txt,col){G.floats.push({x:x,y:y,txt:txt,col:col||'#eaffff',life:1.2})}

function say(html,kind,ms){var e=el('v10Feedback');if(!e){e=document.createElement('div');e.id='v10Feedback';el('canvasWrap').appendChild(e)}e.innerHTML=html;e.className='show '+(kind||'');clearTimeout(say.t);say.t=setTimeout(function(){e.className=''},ms||2800)}
function loseLife(x,y){var now=performance.now();if(G.lastDamage&&now-G.lastDamage<450)return false;G.lastDamage=now;G.lives--;G.combo=1;G.shake=12;burst(x,y,'#ff5f68');var f=el('flash');f.classList.remove('hit');void f.offsetWidth;f.classList.add('hit');tone(150,.18);return true}
function rewardPts(x,y,base){G.combo=Math.min(9,G.combo+1);G.best=Math.max(G.best,G.combo);G.hits++;var pts=base*G.combo;G.score+=pts;burst(x,y,'#58f1d0');tone(600+G.combo*45);floatTxt(x,y-24,'+'+pts,'#7dffcf');return pts}
function bonusSet(v){var b=G.bonus;if(!b||b.done)return;b.value=v;el('bonusProgress').textContent=Math.min(v,b.target)+' / '+b.target;if(v>=b.target){b.done=true;G.score+=350;el('bonusProgress').textContent='✓';msg(tr('bonusDone'));tone(1120,.28);setTimeout(function(){tone(1390,.24)},180)}}
function setObjective(title,text,bonus){$('objectiveTitle').textContent=title;$('objectiveText').textContent=text;if(bonus!=null){$('bonusTitle').textContent=bonus;$('bonusProgress').textContent=G.bonus?(G.bonus.done?'✓':Math.min(G.bonus.value,G.bonus.target)+' / '+G.bonus.target):''}}
function fixObjective(){try{var o=document.querySelector('.objective'),gt=document.querySelector('.gameTop').getBoundingClientRect(),gr=$('game').getBoundingClientRect();o.style.top='';var ob=o.getBoundingClientRect();if(ob.top<gt.bottom+4)o.style.top=(gt.bottom-gr.top+6)+'px'}catch(e){}}
function cleanup(){['v10Vision','v10Report','v10Bins','v10Feedback','v10Diner','v10Gate','controlDock','startFeedback','runnerHint','runnerSpeed','defenseLabel','coreLabel','levelTutorial'].forEach(rm);document.body.classList.remove('runner-mode','defense-mode','v10-l1','v10-l2','v10-l3');var o=document.querySelector('.objective');if(o)o.style.visibility=''}

/* =====================================================================
   TARJETAS DE APRENDIZAJE (antes de cada nivel)
   ===================================================================== */
var CARDS={
1:[
 {ic:'📜',src:'Ministerio de Ambiente · Resolución 2184 de 2019',
  es:{t:'La norma',b:'Desde 2021, en toda Colombia separamos los residuos en tres colores, según la Resolución 2184 de 2019. Separar bien evita que la basura termine en el río.'},
  en:{t:'The rule',b:'Since 2021, people in Colombia sort waste into three colors, following Resolution 2184 of 2019. Good sorting stops trash from ending up in the river.'}},
 {ic:'⚪',es:{t:'Blanca: aprovechables',b:'Plástico, vidrio, metales, papel y cartón, limpios y secos. Ejemplos: botella de agua, lata de gaseosa, caja de cartón.'},
  en:{t:'White: recyclables',b:'Plastic, glass, metal, paper, and cardboard. They must be clean and dry. Examples: a water bottle, a soda can, a cardboard box.'}},
 {ic:'🟢',es:{t:'Verde: orgánicos aprovechables',b:'Cáscaras de frutas y verduras y restos de comida cruda. Ejemplos: cáscara de plátano, de naranja o de mango.'},
  en:{t:'Green: organic waste',b:'Fruit and vegetable peels and raw food scraps. Examples: banana, orange, or mango peels.'}},
 {ic:'⚫',es:{t:'Negra: no aprovechables',b:'Papel higiénico, servilletas usadas y comida preparada. Ejemplos: servilleta sucia, sobras del almuerzo.'},
  en:{t:'Black: non-recyclables',b:'Toilet paper, used napkins, and cooked food. Examples: a dirty napkin, lunch leftovers.'}},
 {ic:'🔴',es:{t:'Punto posconsumo',b:'Las pilas y los celulares no van en ninguna caneca. Llévalos a un punto de recolección posconsumo.'},
  en:{t:'Drop-off point',b:'Batteries and old phones do not go in any bin. You should take them to a drop-off collection point.'}}
],
2:[
 {ic:'⛏️',src:'Cordy et al., 2011 · Science of the Total Environment',
  es:{t:'¿De dónde viene el mercurio?',b:'En el Bajo Cauca, la minería de oro usa mercurio (azogue) para separar el oro. Una parte cae al río desde las dragas y otra se evapora cuando queman la amalgama. Antioquia tiene una de las contaminaciones por mercurio por habitante más altas del mundo.'},
  en:{t:'Where does the mercury come from?',b:'In the Bajo Cauca, gold mining uses mercury to separate gold. Some of it falls into the river from dredges, and some evaporates when miners burn the amalgam. Antioquia has one of the highest levels of mercury pollution per person in the world.'}},
 {ic:'🔬',src:'Acta Biológica Colombiana, vol. 27, 2022',
  es:{t:'Lo que encontraron los científicos',b:'Investigadores analizaron bocachicos y moncholos de La Mojana y del Bajo Cauca. Los peces del Bajo Cauca fueron los más afectados por el mercurio de la minería de oro.'},
  en:{t:'What scientists found',b:'Scientists studied bocachico and moncholo fish from La Mojana and the Bajo Cauca. Fish from the Bajo Cauca had the most mercury from gold mining.'}},
 {ic:'🔺',src:'Romero-Suárez et al., 2022 (La Mojana) · Rev. MVZ Córdoba, embalse de Urrá · INVIMA',
  es:{t:'Tres grupos de peces',b:'El mercurio sube por la cadena: los peces que comen otros peces acumulan más.<br><br>🟢 <b>Menor riesgo:</b> bocachico y vizcaína (comen lodo y algas).<br>🟡 <b>Riesgo medio:</b> comelón y arenca (omnívoros).<br>🔴 <b>Mayor riesgo:</b> bagre rayado, blanquillo, moncholo, pacora, doncella y mojarra amarilla (comen otros peces).'},
  en:{t:'Three groups of fish',b:'Mercury climbs the food chain: fish that eat other fish build up more.<br><br>🟢 <b>Lower risk:</b> bocachico and vizcaína (they eat mud and algae).<br>🟡 <b>Medium risk:</b> comelón and arenca (omnivores).<br>🔴 <b>Higher risk:</b> bagre rayado, blanquillo, moncholo, pacora, doncella, and mojarra amarilla (they eat other fish).'}},
 {ic:'🤰',src:'Revista U.D.C.A (La Mojana) · Ministerio de Salud de Colombia',
  es:{t:'¿Quién debe cuidarse más?',b:'En La Mojana, todas las especies carnívoras superaron el límite recomendado para población vulnerable. Por eso el Ministerio de Salud recomienda que embarazadas, madres lactantes y niños eviten los peces que comen otros peces.'},
  en:{t:'Who should be more careful?',b:'In La Mojana, all carnivorous species went over the recommended limit for vulnerable people. That is why Colombia’s Ministry of Health says pregnant women, breastfeeding mothers, and children should avoid fish that eat other fish.'}},
 {ic:'📍',src:'INVIMA · Organización Mundial de la Salud',
  es:{t:'Pregunta dónde lo pescaron',b:'Cerca de la minería, hasta los peces de menor riesgo pueden acumular mucho mercurio. En el juego, no sirvas ningún pez que esté en la zona de la draga.'},
  en:{t:'Ask where it was caught',b:'Near mining, even lower-risk fish can build up a lot of mercury. In the game, do not serve any fish that is in the dredge zone.'}},
 {ic:'👁️',es:{t:'La Visión de Kael',b:'En la vida real el mercurio no se ve. En el juego, Kael te presta su visión solo 2 veces: muestra cuánto mercurio acumuló cada pez. ¡Úsala con sabiduría!'},
  en:{t:'Kael’s Vision',b:'In real life, you cannot see mercury. In the game, Kael lends you his vision only twice: it shows how much mercury each fish has built up. Use it wisely!'}}
],
3:[
 {ic:'🍃',src:'Brooks et al., 2015 · Tadó, Chocó',
  es:{t:'Balso y malva',b:'En Tadó (Chocó), mineros machacan hojas de balso o malva con agua y echan esa espuma a la batea en lugar del mercurio. Lo llaman «oro verde».'},
  en:{t:'Balsa and malva',b:'In Tadó (Chocó), miners crush balsa or malva leaves with water and put the foam in the gold pan instead of mercury. They call it “green gold”.'}},
 {ic:'🌿',src:'García-Cossio et al., 2017 · Revista Facultad Nacional de Agronomía',
  es:{t:'Más plantas con «baba»',b:'Escoba babosa, escoba negra, yarumo, resucito y guácimo tienen mucílago, una «baba» natural. En el Chocó se han probado para separar el oro.'},
  en:{t:'More slimy plants',b:'Escoba babosa, escoba negra, yarumo, resucito, and guácimo have mucilage, a natural slime. People in Chocó tested them to separate gold.'}},
 {ic:'🍫',src:'Montoya et al., 2024 · Mine Water and the Environment',
  es:{t:'La cáscara de cacao',b:'Una investigación colombiana de 2024 hizo un coagulante con la cáscara de la mazorca de cacao y recuperó el 95 % del oro sin mercurio. ¡Y aprovecha un residuo de un cultivo del Bajo Cauca!'},
  en:{t:'Cocoa pod husks',b:'In 2024, Colombian researchers made a coagulant from cocoa pod husks. It recovered 95% of the gold without mercury, and it uses waste from a crop that grows in the Bajo Cauca!'}},
 {ic:'🔎',es:{t:'No es magia',b:'Estas plantas ayudan a que el oro se separe en la batea, y los científicos siguen estudiándolas. Lo importante: sí existen caminos sin azogue.'},
  en:{t:'It is not magic',b:'These plants help gold separate in the pan, and scientists are still studying them. The key idea: there are ways to work without mercury.'}},
 {ic:'🏠',src:'Ministerio de Salud de Colombia',
  es:{t:'Cuida tu casa',b:'El Ministerio de Salud recomienda no guardar ni quemar amalgama (oro con azogue) dentro de la casa, ni vivir cerca de esos sitios.'},
  en:{t:'Protect your home',b:'The Ministry of Health says people should not keep or burn amalgam (gold with mercury) inside the house, or live near those places.'}},
 {ic:'🐝',src:'Avancemos Bajo Cauca · DNP, diálogos regionales',
  es:{t:'Oficios que ya crecen',b:'El Bajo Cauca tiene potencial para la apicultura, la piscicultura, el cacao y el caucho. También se propone recuperar ciénagas dañadas por la minería para criar peces.'},
  en:{t:'Jobs that are growing',b:'The Bajo Cauca has great potential for beekeeping, fish farming, cocoa, and rubber. There is also a plan to restore wetlands damaged by mining to raise fish.'}}
]};
var HOWTO={
1:{es:[['↔️','Muévete','← → / A D, o arrastra el dedo'],['🎨','Cambia de caneca','Teclas 1 2 3 4 o los botones de color'],['🧺','Atrapa con la caneca correcta','Lo que cae al suelo llega al río']],
   en:[['↔️','Move','← → / A D, or drag your finger'],['🎨','Change bin','Keys 1 2 3 4 or the color buttons'],['🧺','Catch with the right bin','Anything that hits the ground reaches the river']]},
2:{es:[['🍲','Mira para quién cocinas','Niños, embarazadas y madres lactantes: solo 🟢'],['👨','Adultos','🟢 o 🟡 de vez en cuando · 🔴 no cuenta'],['📍','Evita la zona de la draga','Ningún pez de esa zona sirve'],['👁️','Visión de Kael','Botón o ESPACIO · solo 2 usos']],
   en:[['🍲','See who you are cooking for','Children, pregnant women, and breastfeeding mothers: only 🟢'],['👨','Adults','🟢, or 🟡 once in a while · 🔴 does not count'],['📍','Avoid the dredge zone','No fish from that zone is OK'],['👁️','Kael\u2019s Vision','Button or SPACE · only 2 uses']]},
3:{es:[['↔️','Cambia de carril','← → / A D, botones o desliza'],['⬆️','Salta troncos y rocas','↑ / W / ESPACIO'],['🪧','Decide en cada letrero','Entra al carril de la mejor decisión']],
   en:[['↔️','Switch lanes','← → / A D, buttons, or swipe'],['⬆️','Jump over logs and rocks','↑ / W / SPACE'],['🪧','Decide at every sign','Go into the lane with the best decision']]}
};
var learnIdx=0;
function deck(){return CARDS[level].concat([{howto:true}])}
function openLearn(){if(el('v10Learn'))return;syncS10();learnIdx=0;var lay=document.createElement('div');lay.id='v10Learn';lay.setAttribute('role','dialog');lay.setAttribute('aria-modal','true');document.body.appendChild(lay);renderLearn();tone(620,.12);if(typeof closeDialogue==='function')closeDialogue()}
function renderLearn(){
  var lay=el('v10Learn');if(!lay)return;var d=deck(),c=d[learnIdx],last=learnIdx===d.length-1,seen=S10.seen&&S10.seen[level],body;
  if(c.howto){body='<div class="lc-ic">🎮</div><h2>'+(es()?'Cómo jugar':'How to play')+'</h2><div class="howto">'+HOWTO[level][lang].map(function(s){return '<div><span>'+s[0]+'</span><b>'+s[1]+'</b><em>'+s[2]+'</em></div>'}).join('')+'</div><p class="lc-note">'+(es()?'Primero practicarás con ayuda; luego la ayuda desaparecerá poco a poco.':'First you will practice with help; then the help will slowly disappear.')+'</p>'}
  else{var k=c[lang]||c.es;body='<div class="lc-ic">'+c.ic+'</div><h2>'+k.t+'</h2><p>'+k.b+'</p>'+(c.src?'<small class="lc-src">'+(es()?'Fuente: ':'Source: ')+c.src+'</small>':'')}
  lay.innerHTML='<article><header><span>📜 '+(es()?'Kael · Guardián de la Sostenibilidad':'Kael · Guardian of Sustainability')+'</span><b>'+(es()?'NIVEL ':'LEVEL ')+level+' · '+(es()?'APRENDE':'LEARN')+'</b>'+(seen?'<button class="lc-skip">'+(es()?'SALTAR ▶▶':'SKIP ▶▶')+'</button>':'')+'<button class="lc-close" aria-label="Close">×</button></header><div class="lc-card">'+body+'</div><div class="lc-dots">'+d.map(function(_,i){return '<i class="'+(i===learnIdx?'on':'')+'"></i>'}).join('')+'</div><footer><button class="lc-prev" '+(learnIdx?'':'disabled')+'>◀ '+(es()?'ANTERIOR':'BACK')+'</button><button class="gold lc-next">'+(last?(es()?'¡A PRACTICAR! ▶':'LET’S PRACTICE! ▶'):(es()?'SIGUIENTE ▶':'NEXT ▶'))+'</button></footer></article>';
  lay.querySelector('.lc-next').onclick=function(){learnNav(1)};
  lay.querySelector('.lc-prev').onclick=function(){learnNav(-1)};
  lay.querySelector('.lc-close').onclick=function(){closeLearn(false)};
  var sk=lay.querySelector('.lc-skip');if(sk)sk.onclick=function(){closeLearn(true)};
  var sx=null,art=lay.querySelector('article');art.addEventListener('pointerdown',function(e){sx=e.clientX});art.addEventListener('pointerup',function(e){if(sx==null)return;var dx=e.clientX-sx;sx=null;if(Math.abs(dx)>60)learnNav(dx<0?1:-1)});
}
function learnNav(dir){var d=deck();if(dir>0&&learnIdx===d.length-1){closeLearn(true);return}learnIdx=Math.max(0,Math.min(d.length-1,learnIdx+dir));tone(560+learnIdx*40,.05);renderLearn()}
function closeLearn(go){rm('v10Learn');if(go){S10.seen=S10.seen||{};S10.seen[level]=1;saveS10();launch()}}
document.addEventListener('keydown',function(e){if(!el('v10Learn'))return;if(e.key==='ArrowRight'||e.key==='Enter'){e.preventDefault();learnNav(1)}else if(e.key==='ArrowLeft'){e.preventDefault();learnNav(-1)}else if(e.key==='Escape')closeLearn(false)});

/* =====================================================================
   LANZAMIENTO, BUCLE Y DIBUJO
   ===================================================================== */
launch=function(){
  cleanup();show('game');resize();
  var d=DV[S.difficulty]||DV.normal,n=level;
  document.body.classList.add('v10-l'+n);if(n===3)document.body.classList.add('runner-mode');
  $('levelLabel').textContent=(es()?'NIVEL ':'LEVEL ')+n;$('levelTitle').textContent=tr(L[n].title);
  $('guideFace').innerHTML='<img src="'+avatarURL()+'" style="filter:hue-rotate('+(S.color||0)+'deg)">';
  G={score:0,combo:1,best:1,lives:d.lives,time:60,found:0,goal:1,objs:[],parts:[],floats:[],p:{x:C.w/2,y:C.h*.72,w:100,h:120,vx:0,shield:0,power:0},spawn:0,elapsed:0,hits:0,attempts:0,run:false,shake:0,diff:d,practice:true,pose:0,poseUntil:0};
  cvOf(IMG[n]);
  fixObjective();
  try{var ob=document.querySelector('.objective').getBoundingClientRect(),cr=C.getBoundingClientRect();G.topY=Math.max(0,Math.min(C.h*.45,ob.bottom-cr.top))}catch(e){G.topY=0}
  if(n===1)setup1(d);else if(n===2)setup2(d);else setup3(d);
  $('powerBtn').onclick=function(){power()};
  hud();extraHud();count(3);
};

update=function(dt){
  if(!G||!G.run)return;
  var gd=dt*((G.diff&&G.diff.sp)||1);
  G.elapsed+=gd;if(!G.practice&&!(level===3&&G.runner&&G.runner.gate))G.time-=dt;
  if(G.poseUntil&&performance.now()>G.poseUntil)G.pose=0;
  if(level===1)up1(gd);else if(level===2)up2(gd);else up3(gd);
  G.parts.forEach(function(p){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=20*dt;p.life-=dt});G.parts=G.parts.filter(function(p){return p.life>0});
  G.floats.forEach(function(f){f.y-=34*dt;f.life-=dt});G.floats=G.floats.filter(function(f){return f.life>0});
  G.shake*=.86;
  if(G.found>=G.goal)return finishLevel(true);
  if(G.lives<=0)return finishLevel(false);
  if(G.time<=0)return finishLevel(G.found>=Math.ceil(G.goal*.7));
  hud();extraHud();
};
function extraHud(){if(level===3&&G.runner)$('objectiveCount').textContent=G.found+' / '+G.goal+' m'}

draw=function(){
  if(!G)return;X.save();var sh=G.shake||0;X.translate((Math.random()-.5)*sh,(Math.random()-.5)*sh);
  if(level===1)draw1();else if(level===2)draw2();else draw3();
  G.parts.forEach(function(p){X.globalAlpha=Math.max(0,p.life);X.fillStyle=p.c;X.beginPath();X.arc(p.x,p.y,p.s,0,7);X.fill()});X.globalAlpha=1;
  G.floats.forEach(function(f){X.globalAlpha=Math.max(0,Math.min(1,f.life*1.4));X.font='900 15px '+FONT;X.textAlign='center';X.lineWidth=4;X.strokeStyle='rgba(0,15,22,.85)';X.strokeText(f.txt,f.x,f.y);X.fillStyle=f.col;X.fillText(f.txt,f.x,f.y)});X.globalAlpha=1;
  X.restore();
};
tap=function(x,y){if(!G||!G.run)return;if(level===2)tap2(x,y)};
power=function(){if(!G||!G.run)return;if(level===1)selectBin((G.l1.bin+1)%4);else if(level===2)useVision();else if(level===3)jump3()};

function finishLevel(win){
  if(level===2&&G.l2)R2=win?Object.assign({},G.l2.stats):null;
  ['v10Bins','v10Diner','v10Gate','v10Vision'].forEach(rm);var o=document.querySelector('.objective');if(o)o.style.visibility='';
  var l1=G.l1;document.body.classList.remove('v10-l1','v10-l2','v10-l3');
  end(win);
  if(win&&level===1&&l1)$('riverHealth').textContent=Math.round(l1.health*100)+'%';
  setTimeout(function(){if(!$('game').classList.contains('active'))rm('v10Feedback')},50);
}

/* =====================================================================
   NIVEL 1 · LA RIBERA LIMPIA (separación en la fuente)
   ===================================================================== */
var BINS=[
  {c:'#f3f6f7',d:'#8d9da5',ink:'#17262d',es:'Blanca',en:'White',k:'1'},
  {c:'#2fbf63',d:'#17773a',ink:'#ffffff',es:'Verde',en:'Green',k:'2'},
  {c:'#30373d',d:'#05080a',ink:'#ffffff',es:'Negra',en:'Black',k:'3'},
  {c:'#e5484d',d:'#8f1f23',ink:'#ffffff',es:'Posconsumo',en:'Drop-off',k:'4'}
];
var WASTE=[
  {id:'bottle',cat:0,ic:'🧴',es:'Botella plástica',en:'Plastic bottle'},
  {id:'can',cat:0,ic:'🥫',es:'Lata',en:'Can'},
  {id:'box',cat:0,ic:'📦',es:'Caja de cartón',en:'Cardboard box'},
  {id:'jar',cat:0,ic:'🫙',es:'Frasco de vidrio',en:'Glass jar'},
  {id:'paper',cat:0,ic:'📰',es:'Periódico',en:'Newspaper'},
  {id:'banana',cat:1,ic:'🍌',es:'Cáscara de plátano',en:'Banana peel'},
  {id:'mango',cat:1,ic:'🥭',es:'Cáscara de mango',en:'Mango peel'},
  {id:'orange',cat:1,ic:'🍊',es:'Cáscara de naranja',en:'Orange peel'},
  {id:'veg',cat:1,ic:'🥬',es:'Restos de verdura cruda',en:'Raw vegetable scraps'},
  {id:'napkin',cat:2,ic:'🧻',es:'Servilleta usada',en:'Used napkin'},
  {id:'rice',cat:2,ic:'🍛',es:'Sobras de comida preparada',en:'Cooked food leftovers'},
  {id:'chicken',cat:2,ic:'🍗',es:'Sobras de pollo',en:'Chicken leftovers'},
  {id:'battery',cat:3,ic:'🔋',es:'Pila',en:'Battery'},
  {id:'phone',cat:3,ic:'📱',es:'Celular viejo',en:'Old phone'}
];
var CATWHY={
  es:['Es aprovechable: plástico, vidrio, metal, papel o cartón limpio y seco.','Es orgánico aprovechable: cáscaras y restos de comida cruda.','No es aprovechable: está sucio o es comida preparada.','Es un residuo peligroso: no va en ninguna caneca, sino a un punto posconsumo.'],
  en:['It is recyclable: clean, dry plastic, glass, metal, paper, or cardboard.','It is organic waste: peels and raw food scraps.','It is not recyclable: it is dirty or it is cooked food.','It is hazardous waste: it does not go in a bin; it goes to a drop-off point.']
};
function binPhrase(cat){var b=BINS[cat];if(cat===3)return es()?'va al <b style="color:#ff8b8f">punto posconsumo</b>':'goes to the <b style="color:#ff8b8f">drop-off point</b>';return (es()?'va en la caneca ':'goes in the ')+'<b style="color:'+(cat===2?'#c9d3d8':b.c)+'">'+tx(b).toUpperCase()+'</b>'+(es()?'':' bin')}
function wasteById(id){for(var i=0;i<WASTE.length;i++)if(WASTE[i].id===id)return WASTE[i]}

function setup1(d){
  G.goal=d.g1;G.time=d.t1;G.p.y=C.h*.72;G.p.x=C.w/2;
  G.l1={bin:0,health:1,missed:0,queue:['bottle','mango','napkin','battery'],pIdx:0,waiting:false,errors:{},rescue:{},streak:0,fish:[]};
  for(var i=0;i<7;i++)G.l1.fish.push({u:Math.random(),v:rnd(.48,.62),sp:rnd(.02,.05)*(Math.random()<.5?-1:1),ph:Math.random()*6,s:rnd(.75,1.15)});
  G.bonus={value:0,target:8,done:false};
  practiceObjective1();buildBins();
}
function practiceObjective1(){var l=G.l1;setObjective((es()?'PRÁCTICA GUIADA · ':'GUIDED PRACTICE · ')+Math.min(l.pIdx+1,4)+' / 4',es()?'Atrapa cada residuo con la caneca que brilla. Cambia de caneca con 1 2 3 4 o con los botones.':'Catch each piece of waste with the glowing bin. Change bins with 1 2 3 4 or the buttons.',es()?'Especial: 8 residuos bien separados seguidos':'Special: sort 8 pieces of waste in a row')}
function buildBins(){
  rm('v10Bins');var bar=document.createElement('div');bar.id='v10Bins';
  bar.innerHTML=BINS.map(function(b,i){return '<button data-bin="'+i+'" style="--bin:'+b.c+';--bind:'+b.d+'"><i></i><b>'+tx(b)+'</b><kbd>'+b.k+'</kbd></button>'}).join('');
  el('canvasWrap').appendChild(bar);
  bar.querySelectorAll('button').forEach(function(btn){btn.addEventListener('pointerdown',function(e){e.stopPropagation();e.preventDefault();selectBin(+btn.dataset.bin)})});
  updBins(-1,0);
}
function selectBin(i){if(!G||!G.l1)return;G.l1.bin=i;updBins(G.l1.hb,G.l1.hl);tone(480+i*90,.05)}
function updBins(hintBin,hintLevel){var bar=el('v10Bins');if(!bar||!G.l1)return;G.l1.hb=hintBin;G.l1.hl=hintLevel;bar.querySelectorAll('button').forEach(function(b,i){b.classList.toggle('active',i===G.l1.bin);b.classList.toggle('hint-strong',hintLevel===2&&i===hintBin);b.classList.toggle('hint-soft',hintLevel===1&&i===hintBin)})}
function spawnWaste(w,hint,slow){var x=slow?rnd(C.w*.3,C.w*.7):rnd(70,C.w-70);G.objs.push({w:w,x:x,y:(G.topY||0)-10,born:0,vy:slow?72:Math.min(140,70+G.t1*.6+rnd(0,15)),ph:Math.random()*6,hint:hint||0})}
function randomWaste(){var r=Math.random(),cat=r<.34?0:r<.62?1:r<.88?2:3;return pick(WASTE.filter(function(w){return w.cat===cat}))}

function up1(dt){
  var l=G.l1,p=G.p;move(dt);p.y=C.h*.72;
  if(G.practice){
    if(!l.waiting&&l.pIdx<l.queue.length&&!G.objs.length){spawnWaste(wasteById(l.queue[l.pIdx]),l.pIdx<2?2:1,true);l.waiting=true;practiceObjective1()}
  }else{
    G.spawn-=dt;G.t1=(G.t1||0)+dt;
    if(G.spawn<=0&&G.objs.length<(G.t1<30?2:3)){var w=randomWaste(),h=0;if(l.rescue[w.id]){h=2;l.rescue[w.id]=false;say('💡 '+(es()?'Pista: ':'Hint: ')+'<b>'+tx(w)+'</b> '+binPhrase(w.cat)+'.','info',2600)}spawnWaste(w,h,false);G.spawn=Math.max(1.6,2.6-G.t1*.012)}
  }
  var hintT=null;
  G.objs.forEach(function(o){
    o.y+=o.vy*dt;o.x+=Math.sin(G.elapsed*2+o.ph)*14*dt;
    if(!o.dead&&Math.abs(o.x-p.x)<56&&o.y>p.y+4&&o.y<p.y+66){o.dead=1;resolveWaste(o)}
    else if(!o.dead&&o.y>C.h+40){o.dead=1;missWaste(o)}
    if(!o.dead&&o.hint&&(!hintT||o.y>hintT.y))hintT=o;
  });
  G.objs=G.objs.filter(function(o){return !o.dead});
  updBins(hintT?hintT.w.cat:-1,hintT?hintT.hint:0);
  l.fish.forEach(function(f){f.u+=f.sp*dt;if(f.u>1.08)f.u=-.08;if(f.u<-.08)f.u=1.08});
}
function resolveWaste(o){
  var l=G.l1,w=o.w,ok=w.cat===l.bin;G.attempts++;
  if(ok){
    if(!G.practice){G.found++;l.streak++;bonusSet(l.streak)}
    rewardPts(o.x,o.y,10);l.health=Math.min(1,l.health+.04);G.pose=3;G.poseUntil=performance.now()+300;
    if(G.practice||Math.random()<.3)say('✓ '+tx(w)+' '+binPhrase(w.cat)+'.','good',1600);
  }else{
    l.streak=0;bonusSet(0);G.combo=1;l.errors[w.id]=(l.errors[w.id]||0)+1;if(l.errors[w.id]===2)l.rescue[w.id]=true;
    if(!G.practice)loseLife(o.x,o.y);else{tone(200,.12);G.shake=6;burst(o.x,o.y,'#ff5f68')}
    G.pose=4;G.poseUntil=performance.now()+450;
    say('✗ <b>'+tx(w)+'</b> '+binPhrase(w.cat)+'. '+CATWHY[lang][w.cat],'bad',3400);
  }
  if(G.practice){l.waiting=false;if(ok){l.pIdx++;if(l.pIdx>=l.queue.length)endPractice1();else practiceObjective1()}}
}
function missWaste(o){
  var l=G.l1;
  if(G.practice){l.waiting=false;say(es()?'💧 Se escapó. ¡Inténtalo otra vez!':'💧 It got away. Try again!','bad',1700);return}
  l.missed++;l.health=Math.max(0,l.health-.09);l.streak=0;bonusSet(0);G.combo=1;floatTxt(o.x,C.h-70,es()?'💧 ¡Al río!':'💧 Into the river!','#ffb35c');tone(220,.12);
  if(l.missed===1||l.missed%4===0)say(es()?'Cada residuo que se escapa termina en el río y aleja a los peces.':'Every piece of waste that gets away ends up in the river and scares the fish away.','bad',2600);
}
function endPractice1(){
  G.practice=false;G.spawn=1.6;
  setObjective((es()?'SEPARA ':'SORT ')+G.goal+(es()?' RESIDUOS':' PIECES OF WASTE'),es()?'Elige la caneca correcta antes de atrapar. Lo que cae al suelo llega al río.':'Choose the right bin before you catch. Anything that hits the ground reaches the river.',null);
  say(es()?'🌟 ¡Muy bien! Ahora sin ayuda: el brillo desaparece.':'🌟 Well done! Now without help: the glow disappears.','good',2800);tone(880,.2);setTimeout(function(){tone(1100,.18)},150);
}
function smallFish(x,y,s,dir,ph){X.save();X.translate(x,y);X.scale(dir*s,s);X.fillStyle='rgba(205,245,255,.55)';X.beginPath();X.ellipse(0,0,14,5.5,0,0,7);X.fill();var w=Math.sin(G.elapsed*9+ph)*3;X.beginPath();X.moveTo(-11,0);X.lineTo(-21,-6+w);X.lineTo(-21,6+w);X.closePath();X.fill();X.restore()}
function draw1(){
  var l=G.l1;cover(IMG[1]);
  var a=ip(0,.40),b=ip(0,.68),al=(1-l.health)*.6;
  if(al>.01){X.save();X.globalCompositeOperation='multiply';var g=X.createLinearGradient(0,a.y,0,b.y);g.addColorStop(0,'rgba(120,85,40,0)');g.addColorStop(.3,'rgba(120,85,40,'+al+')');g.addColorStop(1,'rgba(95,70,40,'+al+')');X.fillStyle=g;X.fillRect(0,a.y,C.w,b.y-a.y);X.restore()}
  var shown=Math.round(l.health*l.fish.length),sc=Math.max(.7,CV.dw/1500);
  for(var i=0;i<shown;i++){var f=l.fish[i],pt=ip(f.u,f.v);smallFish(pt.x,pt.y,f.s*sc,f.sp>0?1:-1,f.ph)}
  // medidor de salud del río
  var mx=C.w-28,my1=C.h*.36,my2=C.h*.6;X.save();X.fillStyle='rgba(2,20,30,.7)';X.beginPath();X.roundRect(mx-9,my1-6,18,my2-my1+12,9);X.fill();var hh=(my2-my1)*l.health,gg=X.createLinearGradient(0,my2-hh,0,my2);gg.addColorStop(0,l.health>.5?'#58e9ff':'#ffb35c');gg.addColorStop(1,l.health>.5?'#1d8fd8':'#b5562a');X.fillStyle=gg;X.beginPath();X.roundRect(mx-5,my2-hh,10,hh,5);X.fill();X.restore();emoji('💧',mx,my1-20,18);
  player1();
  G.objs.forEach(drawWaste);
}
function drawWaste(o){
  var w=o.w,x=o.x,y=o.y;X.save();X.globalAlpha=Math.min(1,(y-(G.topY||0)+20)/50);
  if(o.hint){var bc=BINS[w.cat].c,pu=.5+.5*Math.sin(G.elapsed*7);X.shadowBlur=o.hint===2?30:14;X.shadowColor=bc;X.strokeStyle=bc;X.globalAlpha=o.hint===2?.95:.4+.2*pu;X.lineWidth=o.hint===2?5:3;X.beginPath();X.arc(x,y,37+pu*4,0,7);X.stroke();X.globalAlpha=1;X.shadowBlur=0}
  X.fillStyle='rgba(2,20,30,.66)';X.beginPath();X.arc(x,y,31,0,7);X.fill();X.strokeStyle='rgba(255,255,255,.35)';X.lineWidth=1.5;X.stroke();X.restore();
  X.save();X.globalAlpha=Math.max(0,Math.min(1,(y-(G.topY||0)+20)/50));emoji(w.ic,x,y+1,34);
  pill(x,y+46,tx(w),'rgba(2,20,30,.88)','#eaffff',12);
  if(o.hint===2){var b=BINS[w.cat];pill(x,y-50,'→ '+tx(b),b.c,b.ink,13)}X.restore();
}
function player1(){
  var p=G.p,l=G.l1,moving=Math.abs(p.vx)>32||P.down,fi=G.pose||(Math.abs(p.vx)>32?(p.vx<0?1:2):0),a=frame(fi)||frame(0),bob=moving?Math.sin(G.elapsed*12)*4:Math.sin(G.elapsed*3)*2;
  X.save();X.fillStyle='rgba(0,17,25,.55)';X.beginPath();X.ellipse(p.x,p.y+80,50,11,0,0,7);X.fill();X.restore();
  X.save();X.translate(p.x,p.y+bob);X.filter='hue-rotate('+(S.color||0)+'deg) drop-shadow(0 8px 8px #00131d)';if(a)X.drawImage(a,-55,-92,110,148);X.filter='none';
  var b=BINS[l.bin];X.shadowBlur=20;X.shadowColor=b.c;var g=X.createLinearGradient(-38,0,38,0);g.addColorStop(0,b.d);g.addColorStop(.5,b.c);g.addColorStop(1,b.d);X.fillStyle=g;X.strokeStyle='rgba(255,255,255,.75)';X.lineWidth=2;X.beginPath();X.moveTo(-40,18);X.lineTo(40,18);X.lineTo(32,80);X.lineTo(-32,80);X.closePath();X.fill();X.stroke();X.shadowBlur=0;X.fillStyle=b.d;X.beginPath();X.roundRect(-44,11,88,9,4);X.fill();
  var lab=tx(b).toUpperCase();X.fillStyle=b.ink;X.font='900 '+(lab.length>7?9:11)+'px '+FONT;X.textAlign='center';X.textBaseline='middle';X.fillText(lab,0,50);
  X.restore();
}
document.addEventListener('keydown',function(e){if(level===3&&G&&G.run&&G.runner&&G.runner.gate&&e.key==='Enter'&&!el('v10Learn')){e.preventDefault();gateReady()}});
document.addEventListener('keydown',function(e){if(level===1&&G&&G.run&&G.l1&&['1','2','3','4'].indexOf(e.key)>=0){selectBin(+e.key-1)}});

/* =====================================================================
   NIVEL 2 · LA OLLA FAMILIAR (mercurio en peces y autocuidado)
   10 especies en 3 grupos de riesgo, zona de la draga y Visión de Kael limitada
   ===================================================================== */
var GROUPS={low:{es:'Menor riesgo',en:'Lower risk',ic:'🟢'},med:{es:'Riesgo medio',en:'Medium risk',ic:'🟡'},high:{es:'Mayor riesgo',en:'Higher risk',ic:'🔴'}};
var FISH={
  bocachico:{es:'Bocachico',art:'el',g:'low',len:50,h:.23,c1:'#dfe8ec',c2:'#7c929e',hg0:[.4,1.2],speed:40,f:{sucker:1,redtail:1},why:{es:'come lodo y algas',en:'it eats mud and algae'}},
  vizcaina:{es:'Vizcaína',art:'la',g:'low',len:36,h:.25,c1:'#eef3f2',c2:'#9aa9a6',hg0:[.2,.9],speed:52,prey:1,f:{tailspot:1},why:{es:'come lodo y algas',en:'it eats mud and algae'}},
  comelon:{es:'Comelón',art:'el',g:'med',len:46,h:.2,c1:'#e2d39a',c2:'#7f7444',hg0:[1.8,3],speed:46,f:{spots3:1},why:{es:'es omnívoro: come de todo',en:'it is an omnivore: it eats a bit of everything'}},
  arenca:{es:'Arenca',art:'la',g:'med',len:30,h:.21,c1:'#f2fbff',c2:'#9db8c6',hg0:[1.2,2.4],speed:60,prey:1,f:{},why:{es:'es omnívora: come insectos y semillas',en:'it is an omnivore: it eats insects and seeds'}},
  bagre:{es:'Bagre rayado',art:'el',g:'high',len:76,h:.16,c1:'#cdb48a',c2:'#4e3e2a',hg0:[4.2,5.6],speed:42,f:{bars:1,whiskers:1}},
  blanquillo:{es:'Blanquillo',art:'el',g:'high',len:70,h:.14,c1:'#f0f2f2',c2:'#8f9aa0',hg0:[4,5.4],speed:46,f:{lstripe:1,whiskers:1,snout:1}},
  moncholo:{es:'Moncholo',art:'el',g:'high',len:54,h:.2,c1:'#7d8a55',c2:'#2f3822',hg0:[3.8,5],speed:46,f:{mottled:1,teeth:1}},
  pacora:{es:'Pacora',art:'la',g:'high',len:58,h:.27,c1:'#e3e8ec',c2:'#7b8790',hg0:[3.8,5],speed:44,f:{}},
  doncella:{es:'Doncella',art:'la',g:'high',len:62,h:.17,c1:'#b9b2a2',c2:'#4b4537',hg0:[4.2,5.8],speed:44,f:{dots:1,bigmouth:1}},
  mojarra:{es:'Mojarra amarilla',art:'la',g:'high',len:46,h:.32,c1:'#f2cf4a',c2:'#8a6a12',hg0:[3.6,4.8],speed:40,f:{spots:1}}
};
var HIGHWHY={es:'come otros peces y acumula más mercurio',en:'it eats other fish, so it builds up more mercury'};
function fname(sp){return sp.es}
function theName(sp,cap){if(!es())return 'The '+sp.es;var a=sp.art+' '+sp.es;return cap?a.charAt(0).toUpperCase()+a.slice(1):a}
var DINERS=[
  {ic:'👧',es:'Niña de 5 años',en:'A 5-year-old girl',vul:true},
  {ic:'🤰',es:'Mujer embarazada',en:'A pregnant woman',vul:true},
  {ic:'🤱',es:'Madre lactante',en:'A breastfeeding mother',vul:true},
  {ic:'👦',es:'Niño de 8 años',en:'An 8-year-old boy',vul:true},
  {ic:'👨',es:'Papá (adulto)',en:'Dad (adult)',vul:false},
  {ic:'🧑‍🌾',es:'Pescador adulto',en:'An adult fisherman',vul:false}
];
var R2=null;
function band2(){var a=ip(0,.63).y,b=ip(0,.93).y;return{a:Math.max(a,C.h*.42),b:Math.min(b,C.h-112)}}
function zone2(){var bd=band2(),c=ip(.6,.72),ry=(bd.b-bd.a)*.42,rx=Math.min(CV.dw*.15,C.w*.2);return{x:Math.max(rx+10,Math.min(C.w-rx-10,c.x)),y:Math.max(bd.a+ry*.8,Math.min(bd.b-ry*.6,c.y)),rx:rx,ry:ry}}
function inZone(o){var z=zone2(),dx=(o.x-z.x)/z.rx,dy=(o.y-z.y)/z.ry;return dx*dx+dy*dy<=1}
function setup2(d){
  G.goal=d.g2;G.time=d.t2;
  G.l2={fish:[],drops:[],dropT:.5,diner:DINERS[0],served:0,streak:0,errors:{},rescue:0,practiceCount:0,firstOk:{},chainTold:0,hintFish:null,hintLevel:0,vision:0,visionLeft:2,hard:S.difficulty==='hard',spd:S.difficulty==='easy'?1:S.difficulty==='hard'?1.45:1.25,stats:{ok:0,medAdult:0,highAdult:0,medVul:0,highVul:0,zone:0}};
  G.bonus={value:0,target:5,done:false};
  var bd=band2();['bocachico','comelon','bagre','vizcaina','pacora','arenca','moncholo'].forEach(function(k,i){var f=spawnFish(k,C.w*(.08+i*.135));f.baseY=bd.a+20+((i*41)%Math.max(30,bd.b-bd.a-30))});
  practiceObjective2();buildDiner();buildVision();
}
function practiceObjective2(){setObjective((es()?'PRÁCTICA GUIADA · ':'GUIDED PRACTICE · ')+Math.min(G.l2.practiceCount+1,3)+' / 3',es()?'Toca el pez que señala Kael para servirlo en la olla.':'Tap the fish Kael points to and serve it in the pot.',es()?'Especial: 5 platos recomendados seguidos':'Special: serve 5 recommended dishes in a row')}
function spawnFish(kind,x){
  var sp=FISH[kind],bd=band2(),dir=Math.random()<.5?1:-1,sc=Math.max(.78,Math.min(1.25,C.w/1100)),spd=(G.l2&&G.l2.spd)||1.25;
  var f={kind:kind,dir:dir,x:x!=null?x:(dir>0?-90:C.w+90),baseY:rnd(bd.a+22,Math.max(bd.a+24,bd.b-12)),y:0,vx:dir*sp.speed*rnd(.85,1.2)*sc*spd,hg:rnd(sp.hg0[0],sp.hg0[1]),ph:Math.random()*6,scale:sc*rnd(.92,1.08),cool:rnd(2,5)};
  f.y=f.baseY;G.l2.fish.push(f);return f;
}
function medPick(){var l=G.l2,c=l.fish.filter(function(f){return f.kind==='comelon'}).length,a=l.fish.filter(function(f){return f.kind==='arenca'}).length;return c===a?pick(['comelon','arenca']):(c<a?'comelon':'arenca')}
function lowPick(){return Math.random()<.62?'vizcaina':'bocachico'}
function randomKind(allowLow){var r=Math.random(),g=allowLow?(r<.22?'low':r<.52?'med':'high'):(r<.42?'med':'high');return g==='low'?lowPick():g==='med'?medPick():pick(Object.keys(FISH).filter(function(k){return FISH[k].g===g}))}
function wanted2(f){var l=G.l2,g=FISH[f.kind].g;if(G.practice||l.diner.vul)return g==='low';return l.noLow?g==='med':(g==='low'||g==='med')}
function up2(dt){
  var l=G.l2,bd=band2(),src=ip(.6,.52),z=zone2(),fdt=G.practice?dt*.6:dt;
  l.chaseCD=(l.chaseCD||0)-dt;if(l.chaser&&(l.chaser.dead||l.fish.indexOf(l.chaser)<0))l.chaser=null;
  if(l.vision>0){l.vision-=dt;if(l.vision<=0){l.vision=0;updVision()}}
  l.dropT-=dt;if(l.dropT<=0){l.drops.push({x:src.x+rnd(-14,14),y:src.y,vx:rnd(-24,24),vy:rnd(10,40),st:0,life:12,ph:Math.random()*6});l.dropT=G.practice?1.3:Math.max(.5,1-G.elapsed*.006)}
  l.drops.forEach(function(d){if(d.st===0){d.vy+=240*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;if(d.y>=z.y-z.ry*.6){d.st=1;d.vy=rnd(-6,10);d.vx=rnd(-30,30)}}else{d.life-=dt;d.vx+=rnd(-30,30)*dt;d.vy+=rnd(-20,20)*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;if(!inZone(d)){d.vx+=(z.x-d.x)*.6*dt;d.vy+=(z.y-d.y)*.6*dt}if(d.life<=0)d.dead=1}});
  var target=C.w<700?8:11;
  var noLow=!G.practice&&!l.diner.vul&&l.noLow,outLow=l.fish.filter(function(f){return FISH[f.kind].g==='low'&&!inZone(f)&&!f.flee}).length,outMed=l.fish.filter(function(f){return FISH[f.kind].g==='med'&&!inZone(f)}).length,needLow=G.practice?2:1;
  if(noLow)l.fish.forEach(function(f){if(FISH[f.kind].g==='low'&&!f.flee){f.flee=1;f.dir=f.x<C.w/2?-1:1;f.vx=f.dir*FISH[f.kind].speed*3*f.scale}});
  if(!noLow&&(G.practice||l.diner.vul)&&outLow<needLow&&l.fish.length<target+2)spawnFish(lowPick());
  else if(noLow&&outMed<2&&l.fish.length<target+2)spawnFish(medPick());
  else if(l.fish.length<target){var k=randomKind(!noLow),highs=l.fish.filter(function(f){return FISH[f.kind].g==='high'}).length;if(FISH[k].g==='high'&&highs>=Math.ceil(target*.45))k=medPick();spawnFish(k)}
  l.fish.forEach(function(f){
    var sp=FISH[f.kind],len=sp.len*f.scale;f.cool-=fdt;
    if(f.flee){f.x+=f.vx*fdt;f.y=f.baseY+Math.sin(G.elapsed*1.4+f.ph)*7;if(f.x<-130||f.x>C.w+130)f.dead=1;return}
    if(sp.g==='high'&&f.cool<=0&&(l.chaser===f||!l.chaser&&(l.chaseCD||0)<=0)){
      var prey=null,best=l.chaser===f?220:150;l.fish.forEach(function(o){if(FISH[o.kind].prey&&!o.dead){var dd=Math.hypot(o.x-f.x,o.y-f.y);if(dd<best){best=dd;prey=o}}});
      if(!prey&&l.chaser===f)l.chaser=null;
      if(prey){l.chaser=f;var dir=prey.x>f.x?1:-1;f.dir=dir;f.vx=dir*sp.speed*1.7*f.scale*l.spd;f.baseY+=(prey.y-f.baseY)*Math.min(1,fdt*1.8);
        if(best<len*.5){prey.dead=1;if(l.hintFish===prey)l.hintFish=null;f.hg+=prey.hg+.8;f.cool=rnd(5,8);l.chaser=null;l.chaseCD=rnd(7,10);f.vx=f.dir*sp.speed*f.scale*l.spd;burst(f.x,f.y,'#ffd36b');if(l.vision>0)floatTxt(f.x,f.y-28,'+Hg','#ffd36b');
          if(!l.chainTold){l.chainTold=1;say('🔺 '+(es()?theName(sp,true)+' se comió '+(prey.kind==='arenca'?'una arenca':'una vizcaína')+' y sumó su mercurio. ¡Así sube el mercurio por la cadena!':theName(sp)+' ate a smaller fish and took in its mercury. That is how mercury climbs the food chain!'),'info',3800)}}}
    }
    f.x+=f.vx*fdt;f.baseY=Math.max(bd.a+12,Math.min(bd.b-6,f.baseY));f.y=f.baseY+Math.sin(G.elapsed*1.4+f.ph)*7;
    if(f.x<-130||f.x>C.w+130)f.dead=1;
    l.drops.forEach(function(d){if(d.st===1&&!d.dead&&Math.hypot(d.x-f.x,d.y-f.y)<len*.45){d.dead=1;f.hg+=.7}});
    f.hg=Math.min(10,f.hg);
  });
  l.fish=l.fish.filter(function(f){return !f.dead});l.drops=l.drops.filter(function(d){return !d.dead});
  var hl=G.practice?(l.practiceCount<2?2:1):(l.rescue>0?2:0);l.hintLevel=hl;
  if(hl){var hf=l.hintFish;if(!hf||hf.dead||hf.flee||!wanted2(hf)||inZone(hf)||hf.x<40||hf.x>C.w-40){l.hintFish=null;var best=1e9;l.fish.forEach(function(f){if(wanted2(f)&&!f.flee&&!inZone(f)&&f.x>70&&f.x<C.w-70){var dd=Math.abs(f.x-C.w/2);if(dd<best){best=dd;l.hintFish=f}}})}}else l.hintFish=null;
}
function tap2(x,y){
  var l=G.l2,hit=null;
  var bestD=1e9;for(var i=l.fish.length-1;i>=0;i--){var f=l.fish[i],len=FISH[f.kind].len*f.scale;if(Math.abs(x-f.x)<len*.62+12&&Math.abs(y-f.y)<len*.32+18){var dd=Math.hypot((x-f.x)/len,(y-f.y)/(len*.5));if(dd<bestD){bestD=dd;hit=f}}}
  if(!hit){tone(260,.04);return}
  var sp=FISH[hit.kind],d=l.diner,st=l.stats,zoned=inZone(hit);G.attempts++;hit.dead=1;l.fish=l.fish.filter(function(f){return f!==hit});
  if(zoned){st.zone++;wrong2('zone',hit,'✗ '+(es()?theName(sp,true)+' estaba en la <b>zona de la draga</b>. Cerca de la minería, hasta los peces de menor riesgo acumulan mucho mercurio. Pregunta siempre dónde lo pescaron.':theName(sp)+' was in the <b>dredge zone</b>. Near mining, even lower-risk fish can build up a lot of mercury. Always ask where the fish was caught.'))}
  else if(sp.g==='high'&&d.vul){st.highVul++;wrong2('high',hit,'✗ 🔴 '+(es()?theName(sp,true)+' '+HIGHWHY.es+'. '+d.es+' debe evitarlo.':theName(sp)+': '+HIGHWHY.en+'. '+d.en+' should avoid it.'))}
  else if(sp.g==='med'&&d.vul){st.medVul++;wrong2('med',hit,'✗ 🟡 '+(es()?theName(sp,true)+' es de riesgo medio ('+sp.why.es+'). Para '+d.es.toLowerCase()+' es mejor bocachico o vizcaína.':theName(sp)+' is medium risk ('+sp.why.en+'). For '+d.en.toLowerCase()+', bocachico or vizcaína is a better choice.'))}
  else if(sp.g==='high'){st.highAdult++;l.streak=0;bonusSet(0);G.combo=1;tone(420,.08);floatTxt(hit.x,hit.y-20,'0','#ffd36b');say('⚠️ 🔴 '+(es()?theName(sp,true)+' '+HIGHWHY.es+'. Un adulto puede comerlo de vez en cuando, pero no cuenta como plato recomendado.':theName(sp)+': '+HIGHWHY.en+'. An adult can eat it once in a while, but it does not count as a recommended dish.'),'info',3600)}
  else if(sp.g==='med'){st.medAdult++;ok2(hit,8)}
  else ok2(hit,15);
}
function ok2(f,base){
  var l=G.l2,sp=FISH[f.kind];rewardPts(f.x,f.y,base);l.served++;l.stats.ok++;
  if(G.practice){l.practiceCount++;if(l.practiceCount>=3)endPractice2();else practiceObjective2()}
  else{G.found++;l.streak++;bonusSet(l.streak);if(l.rescue>0)l.rescue--}
  var first=!l.firstOk[f.kind];l.firstOk[f.kind]=1;
  if(sp.g==='med')say('✓ 🟡 <b>'+fname(sp)+'</b>: '+(es()?'riesgo medio. Para un adulto, de vez en cuando, está bien.':'medium risk. It is OK for an adult once in a while.')+' → 🍲','good',2600);
  else say('✓ 🟢 <b>'+fname(sp)+'</b>'+(first?': '+tx(sp.why):'')+' → 🍲','good',first?2600:1300);
  updDiner();if(!G.practice&&l.served%2===0)setTimeout(nextDiner,700);
}
function wrong2(rule,f,text){
  var l=G.l2;l.streak=0;bonusSet(0);G.combo=1;l.errors[rule]=(l.errors[rule]||0)+1;if(l.errors[rule]%2===0)l.rescue=1;
  if(!G.practice)loseLife(f.x,f.y);else{tone(200,.12);G.shake=6}
  burst(f.x,f.y,'#ff5f68');say(text,'bad',4200);
}
function endPractice2(){
  G.practice=false;
  setObjective((es()?'SIRVE ':'SERVE ')+G.goal+(es()?' PLATOS RECOMENDADOS':' RECOMMENDED DISHES'),es()?'Mira para quién cocinas, elige el grupo de riesgo correcto y no pesques en la zona de la draga.':'Check who you are cooking for, choose the right risk group, and do not fish in the dredge zone.',null);
  say(es()?'🌟 ¡Muy bien! Ahora sin ayuda: Kael ya no señalará el pez.':'🌟 Well done! Now without help: Kael will not point to the fish.','good',3000);tone(880,.2);setTimeout(function(){tone(1100,.18)},150);
}
function nextDiner(){if(!G||!G.l2||!G.run)return;var l=G.l2,pool=Math.random()<.65?DINERS.filter(function(d){return d.vul}):DINERS.filter(function(d){return !d.vul}),n=pick(pool.filter(function(d){return d!==l.diner}));l.diner=n||l.diner;l.noLow=!l.diner.vul&&Math.random()<.6;updDiner(true);tone(700,.1);if(l.noLow&&!l.noLowTold){l.noLowTold=1;setTimeout(function(){say('🟡 '+(es()?'Se fueron los bocachicos y las vizcaínas. Para un adulto, un pez 🟡 está bien de vez en cuando: ¿cuáles son?':'The bocachico and vizcaína swam away. For an adult, a 🟡 fish is OK once in a while. Which ones are they?'),'info',3800)},400)}}
function buildDiner(){rm('v10Diner');var e=document.createElement('div');e.id='v10Diner';el('canvasWrap').appendChild(e);updDiner()}
function updDiner(flash){var e=el('v10Diner');if(!e||!G.l2)return;var d=G.l2.diner;e.innerHTML='<span class="ic">'+d.ic+'</span><div><small>'+(es()?'COCINAS PARA':'YOU ARE COOKING FOR')+'</small><b>'+tx(d)+'</b><em>'+(d.vul?(es()?'Solo peces 🟢':'Only 🟢 fish'):(es()?'Adulto: 🟢 o 🟡':'Adult: 🟢 or 🟡'))+'</em></div><div class="pot">🍲<b>'+G.l2.served+'</b></div>';e.classList.toggle('vul',d.vul);if(flash){e.classList.remove('flash');void e.offsetWidth;e.classList.add('flash')}}
function buildVision(){rm('v10Vision');var b=document.createElement('button');b.id='v10Vision';el('canvasWrap').appendChild(b);b.addEventListener('pointerdown',function(e){e.stopPropagation();e.preventDefault();useVision()});updVision()}
function updVision(){var b=el('v10Vision');if(!b||!G.l2)return;var l=G.l2;b.innerHTML='👁️<span>'+(es()?'Visión de Kael':'Kael’s Vision')+'</span><b>'+(l.vision>0?Math.ceil(l.vision)+'s':'×'+l.visionLeft)+'</b>';b.classList.toggle('on',l.vision>0);b.classList.toggle('empty',l.visionLeft<=0&&l.vision<=0)}
function useVision(){var l=G.l2;if(!G||!G.run||!l||l.vision>0||l.visionLeft<=0)return;l.visionLeft--;l.vision=4;updVision();tone(760,.2);setTimeout(function(){tone(980,.16)},120);say('👁️ '+(es()?'Visión de Kael: el brillo muestra cuánto mercurio acumuló cada pez. Fíjate en los que comen otros peces y en la zona de la draga.':'Kael’s Vision: the glow shows how much mercury each fish has built up. Look at the fish that eat other fish and at the dredge zone.'),'info',3800);var t=setInterval(function(){if(!G||!G.l2||G.l2.vision<=0){clearInterval(t);return}updVision()},500)}
function drawDrop(d){X.save();X.translate(d.x,d.y);X.globalAlpha=d.st?Math.min(.85,d.life/3):.95;var g=X.createLinearGradient(-4,-7,4,6);g.addColorStop(0,'#ffffff');g.addColorStop(.5,'#b9c3cc');g.addColorStop(1,'#59636d');X.fillStyle=g;X.beginPath();X.moveTo(0,-7);X.bezierCurveTo(5,-1,5,5,0,6);X.bezierCurveTo(-5,5,-5,-1,0,-7);X.fill();X.restore()}
function drawFish(f){
  var l=G.l2,sp=FISH[f.kind],ft=sp.f,len=sp.len*f.scale,hgt=len*sp.h,lv=f.hg;
  X.save();X.translate(f.x,f.y);
  if(l.vision>0){var col=lv>=6?'255,80,90':lv>=3?'255,205,90':'120,235,255',r=len*.72+lv*3.4,g=X.createRadialGradient(0,0,len*.18,0,0,r);g.addColorStop(0,'rgba('+col+','+Math.min(.85,.2+lv*.08)+')');g.addColorStop(1,'rgba('+col+',0)');X.fillStyle=g;X.beginPath();X.arc(0,0,r,0,7);X.fill();X.strokeStyle='rgba('+col+',.85)';X.lineWidth=2.5;X.beginPath();X.arc(0,0,len*.6+lv*1.5,0,7);X.stroke()}
  X.scale(f.dir,1);var w=Math.sin(G.elapsed*10+f.ph)*hgt*.35;
  var bg=X.createLinearGradient(0,-hgt,0,hgt);bg.addColorStop(0,sp.c2);bg.addColorStop(.45,sp.c1);bg.addColorStop(1,sp.c2);X.fillStyle=bg;
  X.beginPath();X.moveTo(-len*.4,0);X.lineTo(-len*.72,-hgt*1.05+w);X.lineTo(-len*.62,0);X.lineTo(-len*.72,hgt*1.05+w);X.closePath();X.fill();
  X.beginPath();X.ellipse(0,0,len*.5,hgt,0,0,7);X.fill();
  X.beginPath();X.moveTo(-len*.12,-hgt*.9);X.quadraticCurveTo(len*.02,-hgt*1.75,len*.14,-hgt*.9);X.closePath();X.fill();
  var i;
  if(ft.snout){X.fillStyle=sp.c2;X.beginPath();X.ellipse(len*.52,hgt*.05,len*.14,hgt*.45,0,0,7);X.fill()}
  if(ft.bars){X.strokeStyle='rgba(40,28,15,.75)';X.lineWidth=2.4;for(i=-2;i<=2;i++){X.beginPath();X.moveTo(i*len*.09,-hgt*.8);X.lineTo(i*len*.09+3,hgt*.6);X.stroke()}}
  if(ft.lstripe){X.strokeStyle='rgba(30,35,40,.8)';X.lineWidth=Math.max(2,hgt*.28);X.beginPath();X.moveTo(-len*.42,0);X.lineTo(len*.46,0);X.stroke()}
  if(ft.whiskers){X.strokeStyle='#2b2418';X.lineWidth=1.5;X.beginPath();X.moveTo(len*.46,hgt*.2);X.quadraticCurveTo(len*.66,hgt*.5,len*.62,hgt*1.1);X.moveTo(len*.46,hgt*.05);X.quadraticCurveTo(len*.72,0,len*.76,hgt*.7);X.stroke()}
  if(ft.mottled){X.fillStyle='rgba(25,30,15,.55)';for(i=0;i<5;i++){X.beginPath();X.arc(-len*.25+i*len*.11,(i%2?-1:1)*hgt*.3,hgt*.22,0,7);X.fill()}}
  if(ft.teeth){X.fillStyle='#fff';for(i=0;i<3;i++){X.beginPath();X.moveTo(len*.38+i*4,hgt*.24-i*1.5);X.lineTo(len*.4+i*4,hgt*.4-i*1.5);X.lineTo(len*.42+i*4,hgt*.22-i*1.5);X.fill()}}
  if(ft.dots){X.fillStyle='rgba(30,26,18,.7)';for(i=0;i<9;i++){X.beginPath();X.arc(-len*.3+(i%5)*len*.14,(i<5?-1:1)*hgt*.35,Math.max(1.5,hgt*.13),0,7);X.fill()}}
  if(ft.bigmouth){X.strokeStyle='#2a251c';X.lineWidth=2;X.beginPath();X.moveTo(len*.5,hgt*.05);X.lineTo(len*.28,hgt*.35);X.stroke()}
  if(ft.spots){X.fillStyle='rgba(60,40,5,.7)';[[-.2,-.3],[0,.1],[.18,-.25],[-.05,-.5],[.25,.25]].forEach(function(p){X.beginPath();X.arc(len*p[0],hgt*p[1],Math.max(2,hgt*.14),0,7);X.fill()})}
  if(ft.spots3){X.fillStyle='rgba(40,35,15,.8)';[-.22,0,.2].forEach(function(px){X.beginPath();X.arc(len*px,0,Math.max(2,hgt*.24),0,7);X.fill()})}
  if(ft.tailspot){X.fillStyle='rgba(30,30,30,.75)';X.beginPath();X.arc(-len*.38,0,Math.max(2,hgt*.22),0,7);X.fill()}
  if(ft.redtail){X.fillStyle='rgba(230,90,70,.55)';X.beginPath();X.moveTo(-len*.42,0);X.lineTo(-len*.7,-hgt*.95+w);X.lineTo(-len*.62,0);X.closePath();X.fill()}
  if(ft.sucker){X.strokeStyle='#5d6f78';X.lineWidth=1.6;X.beginPath();X.arc(len*.49,hgt*.15,hgt*.18,0,7);X.stroke()}
  X.fillStyle='#ffffff';X.beginPath();X.arc(len*.3,-hgt*.25,Math.max(2.5,len*.055),0,7);X.fill();X.fillStyle='#0b1b28';X.beginPath();X.arc(len*.31,-hgt*.25,Math.max(1.3,len*.03),0,7);X.fill();
  X.restore();
  if(!l.hard)pill(f.x,f.y+hgt+15,fname(sp),'rgba(2,20,30,.82)','#eaffff',11);
}
function draw2(){
  var l=G.l2,z=zone2();cover(IMG[2]);X.fillStyle=l.vision>0?'rgba(0,25,45,.38)':'rgba(0,10,20,.2)';X.fillRect(0,0,C.w,C.h);
  var src=ip(.6,.52);pill(src.x,src.y-42,es()?'⛏️ Draga minera · usa mercurio':'⛏️ Mining dredge · uses mercury','rgba(80,24,10,.85)','#ffd7a8',11);
  X.save();var zg=X.createRadialGradient(z.x,z.y,4,z.x,z.y,Math.max(z.rx,z.ry));zg.addColorStop(0,'rgba(95,80,55,.55)');zg.addColorStop(1,'rgba(95,80,55,.18)');X.fillStyle=zg;X.beginPath();X.ellipse(z.x,z.y,z.rx,z.ry,0,0,7);X.fill();X.setLineDash([8,6]);X.strokeStyle='rgba(255,170,90,.85)';X.lineWidth=2;X.stroke();X.setLineDash([]);X.restore();
  pill(z.x,z.y-z.ry-10,es()?'🚫 Zona de la draga · no pescar aquí':'🚫 Dredge zone · do not fish here','rgba(90,40,10,.9)','#ffe1c2',11);
  l.drops.forEach(drawDrop);l.fish.forEach(drawFish);
  var h=l.hintFish;if(h&&l.hintLevel){var len=FISH[h.kind].len*h.scale,pu=.5+.5*Math.sin(G.elapsed*7);X.save();X.strokeStyle='#7dffcf';X.shadowColor='#7dffcf';X.shadowBlur=l.hintLevel===2?24:10;X.globalAlpha=l.hintLevel===2?.95:.45+.2*pu;X.lineWidth=l.hintLevel===2?4:2.5;X.beginPath();X.arc(h.x,h.y,len*.66+pu*5,0,7);X.stroke();X.restore();
    if(l.hintLevel===2){emoji('👇',h.x,h.y-len*.62-30+Math.sin(G.elapsed*6)*5,30);pill(h.x,h.y-len*.62-58,es()?'Tócame ✓':'Tap me ✓','#7dffcf','#03241a',12)}}
}
/* Informe de Kael al terminar el nivel 2 */
function openReport(){rm('v10Report');var lay=document.createElement('div');lay.id='v10Report';lay.setAttribute('role','dialog');document.body.appendChild(lay);renderReport();tone(700,.15)}
function renderReport(){
  var lay=el('v10Report');if(!lay||!R2)return;var s=R2,E=es(),errs=[];
  if(s.highVul)errs.push((E?'Peces 🔴 para personas sensibles: ':'🔴 fish for sensitive people: ')+s.highVul);
  if(s.medVul)errs.push((E?'Peces 🟡 para personas sensibles: ':'🟡 fish for sensitive people: ')+s.medVul);
  if(s.zone)errs.push((E?'Peces de la zona de la draga: ':'Fish from the dredge zone: ')+s.zone);
  if(s.highAdult)errs.push((E?'Peces 🔴 para adultos (no cuentan): ':'🔴 fish for adults (do not count): ')+s.highAdult);
  lay.innerHTML='<article><header><span>📜 '+(E?'Informe de Kael · Guardián de la Sostenibilidad':'Kael’s Report · Guardian of Sustainability')+'</span></header>'
  +'<section class="rp"><h4>'+(E?'TU RESULTADO':'YOUR RESULTS')+'</h4><p>'+(E?'Serviste <b>'+s.ok+'</b> platos recomendados.':'You served <b>'+s.ok+'</b> recommended dishes.')+'</p>'+(errs.length?'<ul>'+errs.map(function(e){return '<li>'+e+'</li>'}).join('')+'</ul>':'<p>'+(E?'¡Sin errores! 🌟':'No mistakes! 🌟')+'</p>')+'</section>'
  +'<section class="rp"><h4>'+(E?'LO QUE DICE LA INVESTIGACIÓN':'WHAT THE RESEARCH SAYS')+'</h4><ul>'
   +'<li>'+(E?'El Bajo Cauca fue la región más afectada por metilmercurio en bocachico y moncholo.':'The Bajo Cauca was the region most affected by methylmercury in bocachico and moncholo.')+' <small>(Acta Biológica Colombiana, 2022)</small></li>'
   +'<li>'+(E?'Los peces carnívoros —bagre rayado, pacora y moncholo— tuvieron más mercurio; los que comen lodo, como el bocachico y la vizcaína, tuvieron menos.':'Carnivorous fish —bagre rayado, pacora, and moncholo— had the most mercury; mud-eating fish, like bocachico and vizcaína, had less.')+' <small>(Rev. MVZ Córdoba, 2022)</small></li>'
   +'<li>'+(E?'Ninguna especie superó el límite de la Unión Europea (0,5 µg/g), pero todas las carnívoras superaron el límite recomendado para población vulnerable (0,2 µg/g).':'No species went over the European Union limit (0.5 µg/g), but all carnivorous species went over the recommended limit for vulnerable people (0.2 µg/g).')+' <small>(Revista U.D.C.A, La Mojana)</small></li>'
  +'</ul></section>'
  +'<section class="rp"><h4>'+(E?'¿QUÉ LE HACE EL MERCURIO AL CUERPO?':'WHAT DOES MERCURY DO TO THE BODY?')+'</h4><ul>'
   +'<li>'+(E?'Es tóxico para el sistema nervioso.':'It is toxic to the nervous system.')+'</li>'
   +'<li>'+(E?'En el embarazo puede dañar el cerebro del bebé y afectar después su memoria, concentración, lenguaje y motricidad fina.':'During pregnancy, it can damage the baby’s brain and later affect memory, concentration, language, and fine motor skills.')+'</li>'
   +'<li>'+(E?'También puede afectar el sistema inmunitario, el aparato digestivo, los riñones, los pulmones, los ojos y la piel.':'It can also affect the immune system, the digestive system, the kidneys, the lungs, the eyes, and the skin.')+' <small>(OMS · OPS)</small></li>'
  +'</ul></section>'
  +'<section class="rp key"><h4>'+(E?'RECUERDA':'REMEMBER')+'</h4><p>'+(E?'Cocinar el pescado <b>no elimina</b> el mercurio. No dejes de comer pescado: prefiere <b>bocachico o vizcaína</b> y pregunta siempre <b>dónde lo pescaron</b>.':'Cooking fish <b>does not remove</b> mercury. Do not stop eating fish: choose <b>bocachico or vizcaína</b> and always ask <b>where it was caught</b>.')+'</p></section>'
  +'<footer><button class="gold rp-go">'+(E?'CONTINUAR ▶':'CONTINUE ▶')+'</button></footer></article>';
  lay.querySelector('.rp-go').onclick=function(){rm('v10Report');prevNext()};
}
var prevNext=next;
next=function(){if(level===2&&R2)openReport();else prevNext()};
$('continueBtn').onclick=function(){next()};
window.__v10dbg={FISH:FISH,inZone:inZone,DINERS:DINERS,updDiner:updDiner,R2:function(){return R2}};

/* =====================================================================
   NIVEL 3 · LA RUTA DEL ORO VERDE (carrera con decisiones)
   ===================================================================== */
var PLANTS=[
  {id:'balso',ic:'🍃',es:'Balso',en:'Balsa',fact:{es:'sus hojas con agua reemplazan el mercurio en la batea.',en:'its leaves mixed with water replace mercury in the gold pan.'}},
  {id:'malva',ic:'🌺',es:'Malva',en:'Malva',fact:{es:'en Tadó también la usan para el «oro verde».',en:'miners in Tadó also use it for “green gold”.'}},
  {id:'escoba',ic:'🌿',es:'Escoba babosa',en:'Escoba babosa',fact:{es:'su «baba» natural ayuda a separar el oro.',en:'its natural slime helps separate gold.'}},
  {id:'yarumo',ic:'🍁',es:'Yarumo',en:'Yarumo',fact:{es:'se ha probado en el Chocó para separar oro.',en:'people in Chocó tested it to separate gold.'}},
  {id:'cacao',ic:'',es:'Cáscara de cacao',en:'Cocoa husk',fact:{es:'con ella se recuperó el 95 % del oro sin mercurio.',en:'researchers recovered 95% of the gold with it, without mercury.'}}
];
var OBST={log:{es:'Tronco · ↑ salta',en:'Log · ↑ jump'},rock:{es:'Roca · ↑ salta',en:'Rock · ↑ jump'},flask:{es:'Azogue · esquiva',en:'Mercury · dodge'},smoke:{es:'Humo de amalgama · esquiva',en:'Amalgam smoke · dodge'}};
var OBWHY={
  log:{es:'Salta con ↑ para pasar el tronco.',en:'Jump with ↑ to get over the log.'},
  rock:{es:'Salta con ↑ para pasar la roca.',en:'Jump with ↑ to get over the rock.'},
  flask:{es:'¡El azogue es tóxico! No lo toques: cambia de carril.',en:'Mercury is toxic! Do not touch it: switch lanes.'},
  smoke:{es:'El humo de la amalgama es vapor de mercurio: ¡no lo respires! Cambia de carril.',en:'Amalgam smoke is mercury vapor: do not breathe it! Switch lanes.'}
};
var JOBS={
  oro:{ic:'✨',es:'Oro verde (sin mercurio)',en:'Green gold (no mercury)'},
  abejas:{ic:'🐝',es:'Apicultura',en:'Beekeeping'},
  peces:{ic:'🐟',es:'Piscicultura',en:'Fish farming'},
  cacao:{ic:'🍫',es:'Cacao y caucho',en:'Cocoa and rubber'}
};
var GATES=[
 {unlock:'oro',
  q:{es:'Un minero quiere dejar el azogue. ¿Qué puede echar a la batea?',en:'A miner wants to stop using mercury. What can he put in the gold pan?'},
  opts:{es:['Hojas de balso machacadas con agua','Más azogue para que rinda','Gasolina'],en:['Crushed balsa leaves with water','More mercury','Gasoline']},
  ok:{es:'¡Así lo hacen mineros de Tadó (Chocó)! Es el «oro verde».',en:'Miners in Tadó (Chocó) do this! It is called “green gold”.'},
  no:{es:'El azogue y la gasolina contaminan. En Tadó usan hojas de balso o malva con agua.',en:'Mercury and gasoline pollute. In Tadó, miners use balsa or malva leaves with water.'}},
 {unlock:null,
  q:{es:'Don Luis cosechó cacao y le sobraron muchas cáscaras. ¿Para qué sirven?',en:'Don Luis harvested cocoa and had a lot of husks left. What are they good for?'},
  opts:{es:['Para hacer un coagulante que separa el oro sin mercurio','Para quemar la amalgama','Para tirarlas al río'],en:['Making a coagulant that separates gold without mercury','Burning amalgam','Throwing them into the river']},
  ok:{es:'¡Correcto! Una investigación de 2024 recuperó el 95 % del oro con cáscara de cacao.',en:'Correct! In 2024, researchers recovered 95% of the gold with cocoa husks.'},
  no:{es:'Las cáscaras de cacao pueden reemplazar el mercurio: así lo mostró una investigación colombiana.',en:'Cocoa husks can replace mercury. Colombian research showed it.'}},
 {unlock:null,
  q:{es:'Tu vecino guarda y quema amalgama en la cocina. ¿Qué es lo correcto?',en:'Your neighbor keeps and burns amalgam in the kitchen. What should you do?'},
  opts:{es:['Pedirle que no guarde ni queme amalgama dentro de la casa','Cerrar las ventanas y seguir','Acercarse para ver mejor'],en:['Ask him not to keep or burn amalgam inside the house','Close the windows and carry on','Go closer to see better']},
  ok:{es:'¡Bien! El vapor de mercurio es muy peligroso: nunca dentro de la casa.',en:'Good! Mercury vapor is very dangerous: never inside the house.'},
  no:{es:'El Ministerio de Salud recomienda no guardar ni quemar amalgama dentro de la casa.',en:'The Ministry of Health says: do not keep or burn amalgam inside the house.'}},
 {unlock:'abejas',
  q:{es:'Doña Rosa trabajó diez años en la mina y la dejó. ¿Qué puede empezar?',en:'Rosa worked in a mine for ten years. Then she left. What can she start?'},
  opts:{es:['Apicultura: producir miel','Comprar una draga','Vender azogue'],en:['Beekeeping: producing honey','Buying a dredge','Selling mercury']},
  ok:{es:'¡Sí! Cientos de familias del Bajo Cauca ya producen miel.',en:'Yes! Hundreds of families in the Bajo Cauca already produce honey.'},
  no:{es:'La apicultura es una opción real: muchas familias del Bajo Cauca producen miel.',en:'Beekeeping is a real option: many families in the Bajo Cauca produce honey.'}},
 {unlock:'peces',
  q:{es:'La minería dañó una ciénaga cerca de Caucasia. ¿Qué se propone hacer?',en:'Mining damaged a wetland near Caucasia. What is the plan?'},
  opts:{es:['Recuperarla para la piscicultura sostenible','Abrir otra mina','Usarla como basurero'],en:['Restore it for sustainable fish farming','Open another mine','Use it as a garbage dump']},
  ok:{es:'¡Exacto! Recuperar ciénagas para criar peces es una propuesta de la región.',en:'Exactly! Restoring wetlands to raise fish is a proposal from the region.'},
  no:{es:'La región propone recuperar las ciénagas dañadas para la piscicultura sostenible.',en:'The region proposes restoring damaged wetlands for sustainable fish farming.'}},
 {unlock:'cacao',
  q:{es:'¿Qué cultivos tienen gran potencial en el Bajo Cauca?',en:'Which crops have great potential in the Bajo Cauca?'},
  opts:{es:['Cacao y caucho','Ninguno: solo el oro da dinero','Ninguno: la tierra ya no sirve'],en:['Cocoa and rubber','None: only gold makes money','None: the land is useless now']},
  ok:{es:'¡Así es! La región tiene gran potencial para el cacao y el caucho.',en:'That’s right! The region has great potential for cocoa and rubber.'},
  no:{es:'El Bajo Cauca tiene tierras fértiles con gran potencial para el cacao y el caucho.',en:'The Bajo Cauca has fertile land with great potential for cocoa and rubber.'}}
];
function plantById(id){for(var i=0;i<PLANTS.length;i++)if(PLANTS[i].id===id)return PLANTS[i]}

function setup3(d){
  syncS10();
  G.goal=d.g3;G.time=d.t3;
  G.runner={readT:S.difficulty==='easy'?22:S.difficulty==='hard'?15:18,lane:0,visualLane:0,distance:0,jumpTime:0,jumpDuration:.92,spawn:1,controlLock:0,speed:9,objects:[],gates:[.1,.24,.38,.52,.66,.8].map(function(f){return Math.round(f*G.goal)}),gi:0,gate:null,gateErr:0,rescue:0,plants:{},practiceStep:0,hits:{},teachAgain:{},vp:{x:C.w/2,y:C.h*.25},yb:C.h,spread:100};
  G.bonus={value:0,target:5,done:false};
  setObjective(es()?'PRÁCTICA GUIADA':'GUIDED PRACTICE',es()?'Salta el tronco con ↑, esquiva el humo cambiando de carril y recoge plantas.':'Jump over the log with ↑, dodge the smoke by switching lanes, and collect plants.',es()?'Especial: recoge las 5 plantas distintas':'Special: collect all 5 different plants');
  $('powerBtn').textContent='⬆️';$('powerBtn').classList.remove('ready','cooldown');
}
function lane3(dir){var r=G.runner,n=Math.max(-1,Math.min(1,r.lane+dir));if(n!==r.lane){r.lane=n;G.pose=dir<0?1:2;G.poseUntil=performance.now()+260;tone(390,.055)}}
function jump3(){var r=G.runner;if(!r||r.jumpTime>0)return;r.jumpTime=r.jumpDuration;G.pose=3;G.poseUntil=performance.now()+r.jumpDuration*1000;tone(650,.09);setTimeout(function(){tone(820,.07)},80)}
function jumpH(){var r=G.runner;if(!r||r.jumpTime<=0)return 0;var p=(r.jumpDuration-r.jumpTime)/r.jumpDuration;return Math.sin(p*Math.PI)*118}
function mk3(type,lane,z){return{type:type,lane:lane,z:z||0,checked:false,dead:false,ph:Math.random()*6,kind:type==='plant'?pick(PLANTS).id:null}}
function up3(dt){
  var r=G.runner;if(!r)return;
  r.controlLock=Math.max(0,r.controlLock-dt);if(r.controlLock<=0){if(keys.ArrowLeft||keys.a){lane3(-1);r.controlLock=.23}else if(keys.ArrowRight||keys.d){lane3(1);r.controlLock=.23}}
  r.jumpTime=Math.max(0,r.jumpTime-dt);
  var raw=dt/((G.diff&&G.diff.sp)||1),target=r.gate?(r.gate.checked?4:2):(G.practice?6:Math.min(10,7+G.elapsed*.02));r.speed+=(target-r.speed)*Math.min(1,dt*2);
  r.distance+=r.speed*dt;G.found=Math.min(G.goal,Math.floor(r.distance));
  if(G.practice){
    var steps=[[10,'log'],[34,'smoke'],[58,'plant',-1,'balso'],[72,'plant',1,'malva']];
    while(r.practiceStep<steps.length&&r.distance>=steps[r.practiceStep][0]){var s=steps[r.practiceStep],o=mk3(s[1],s.length>2?s[2]:r.lane);if(s[3])o.kind=s[3];o.teach=1;r.objects.push(o);r.practiceStep++}
    if(r.practiceStep>=steps.length&&!r.objects.some(function(o){return o.teach})){G.practice=false;setObjective((es()?'RECORRE ':'RUN ')+G.goal+' m',es()?'En cada letrero, entra al carril de la mejor decisión. Recoge plantas y esquiva el azogue.':'At every sign, go into the lane with the best decision. Collect plants and dodge mercury.',null);say(es()?'🌟 ¡Bien! Ahora vienen los letreros: entra al carril de la mejor decisión.':'🌟 Great! Now the signs are coming: go into the lane with the best decision.','good',3000)}
  }else if(!r.gate&&r.gi<r.gates.length&&r.distance>=r.gates[r.gi])openGate();
  var nextGate=r.gi<r.gates.length?r.gates[r.gi]:1e9;
  if(!G.practice&&!r.gate&&r.distance<nextGate-30){r.spawn-=dt;if(r.spawn<=0){wave3();r.spawn=Math.max(1.5,2.3-G.elapsed*.004)}}
  r.objects.forEach(function(o){if(o.type==='gate')o.z+=raw*(o.checked?.3:(o.ready?.3:.81/r.readT));else o.z+=dt*(.16+r.speed*.004);if(!o.checked&&o.z>.81){o.checked=true;if(o.type==='gate')resolveGate(o);else hit3(o)}if(o.z>1.25)o.dead=true});
  r.objects=r.objects.filter(function(o){return !o.dead});r.visualLane+=(r.lane-r.visualLane)*Math.min(1,dt*11);
  if(r.gate&&!r.gate.checked)updGatePanel();
}
function wave3(){
  var r=G.runner,roll=Math.random(),lanes=[-1,0,1];
  if(roll<.45){var ln=pick(lanes);r.objects.push(mk3('plant',ln));if(Math.random()<.35)r.objects.push(mk3('plant',ln,-.16))}
  else if(roll<.8){var t=pick(['log','rock','flask','smoke']),o=mk3(t,pick(lanes));if(r.teachAgain[t]){o.teach=2;r.teachAgain[t]=0}r.objects.push(o)}
  else{var safe=lanes.splice(Math.floor(Math.random()*3),1)[0];lanes.forEach(function(ln){r.objects.push(mk3(pick(['rock','flask','smoke']),ln))});r.objects.push(mk3('plant',safe,-.12))}
}
function hit3(o){
  var r=G.runner;if(o.lane!==r.lane)return;
  var px=laneX(o.lane,playerY()),py=playerY();
  if(o.type==='plant'){o.dead=true;var pl=plantById(o.kind),first=!r.plants[o.kind];r.plants[o.kind]=(r.plants[o.kind]||0)+1;S10.plants[o.kind]=1;G.attempts++;rewardPts(px,py-jumpH()-40,25);floatTxt(px,py-jumpH()-70,tx(pl),'#b9ffcf');bonusSet(Object.keys(r.plants).length);if(first)say('🌿 <b>'+tx(pl)+'</b>: '+tx(pl.fact),'good',3000);return}
  if((o.type==='log'||o.type==='rock')&&jumpH()>48){G.score+=35;G.combo=Math.min(9,G.combo+1);G.best=Math.max(G.best,G.combo);burst(px,py-jumpH(),'#ffe477');tone(870,.07);return}
  o.dead=true;G.attempts++;r.hits[o.type]=(r.hits[o.type]||0)+1;if(r.hits[o.type]%2===0)r.teachAgain[o.type]=1;
  if(G.practice||o.teach===1){tone(200,.12);G.shake=6;burst(px,py,'#ff5f68')}else loseLife(px,py);
  G.pose=4;G.poseUntil=performance.now()+450;say('✗ '+tx(OBWHY[o.type]),'bad',2600);
}
function openGate(){
  var r=G.runner,gd=GATES[r.gi],order=[0,1,2].sort(function(){return Math.random()-.5}),o=mk3('gate',0);
  o.data=gd;o.order=order;o.correctLane=order.indexOf(0)-1;o.hint=r.gi===0?2:r.gi===1?1:(r.rescue>0?1:0);if(r.gi>1&&o.hint)r.rescue=0;
  r.objects.push(o);r.gate=o;buildGatePanel(o);tone(700,.15);
}
function placeLikeObjective(p){var ob=document.querySelector('.objective'),gr=$('game').getBoundingClientRect(),rr=ob.getBoundingClientRect();p.style.top=(rr.top-gr.top)+'px';p.style.left=(rr.left-gr.left)+'px';p.style.width=rr.width+'px'}
function buildGatePanel(o){rm('v10Gate');var p=document.createElement('div');p.id='v10Gate';$('game').appendChild(p);placeLikeObjective(p);var ob=document.querySelector('.objective');if(ob)ob.style.visibility='hidden';renderGatePanel(o)}
function renderGatePanel(o){
  var p=el('v10Gate');if(!p)return;var g=o.data,ar=['◀','▲','▶'],opts=tx(g.opts);
  p.className='';p.innerHTML='<small>🪧 '+(es()?'LETRERO ':'SIGN ')+(G.runner.gi+1)+' / '+GATES.length+' · '+(es()?'ENTRA AL CARRIL DE LA MEJOR DECISIÓN':'GO INTO THE LANE WITH THE BEST DECISION')+'</small><h3>'+tx(g.q)+'</h3><div class="opts">'+o.order.map(function(oi,li){return '<div class="opt" data-lane="'+(li-1)+'"><kbd>'+ar[li]+'</kbd><span>'+opts[oi]+'</span></div>'}).join('')+'</div><div class="gfoot"><i class="gbar"><b></b></i><em>'+(es()?'Elige tu carril con ◀ ▶ y pulsa LISTO':'Choose your lane with ◀ ▶ and press READY')+'</em><button class="gold g-ready">'+(es()?'✔ ¡LISTO!':'✔ READY!')+'</button></div>';
  var gb=p.querySelector('.g-ready');gb.addEventListener('pointerdown',function(e){e.stopPropagation();e.preventDefault();gateReady()});
  updGatePanel();
}
function gateReady(){var r=G&&G.runner,o=r&&r.gate;if(!o||o.checked||o.ready)return;o.ready=true;tone(820,.08);var b=el('v10Gate')&&el('v10Gate').querySelector('.g-ready');if(b){b.disabled=true;b.textContent='…'}}
function updGatePanel(){var r=G.runner,o=r.gate,p=el('v10Gate');if(!p||!o||o.checked)return;var bar=p.querySelector('.gbar b');if(bar)bar.style.width=Math.max(0,100-o.z/.81*100)+'%';p.querySelectorAll('.opt').forEach(function(d){var ln=+d.dataset.lane;d.classList.toggle('current',ln===r.lane);d.classList.toggle('hint-strong',o.hint===2&&ln===o.correctLane);d.classList.toggle('hint-soft',o.hint===1&&ln===o.correctLane)})}
function resolveGate(o){
  var r=G.runner,g=o.data,ok=r.lane===o.correctLane,p=el('v10Gate'),py=playerY(),px=laneX(r.lane,py);G.attempts++;
  if(ok){G.hits++;G.score+=150;G.combo=Math.min(9,G.combo+1);G.best=Math.max(G.best,G.combo);burst(px,py-40,'#ffe477');burst(px,py-60,'#7dffcf');floatTxt(px,py-90,'+150','#ffe477');tone(900,.2);setTimeout(function(){tone(1200,.18)},140);if(g.unlock){S10.jobs[g.unlock]=1;saveS10()}}
  else{r.gateErr++;if(r.gateErr%2===0)r.rescue=1;G.score=Math.max(0,G.score-50);G.combo=1;tone(180,.22);G.shake=8}
  if(p){p.className=ok?'ok':'no';p.innerHTML='<small>'+(ok?'✓ '+(es()?'BUENA DECISIÓN':'GOOD DECISION'):'✗ '+(es()?'HABÍA UNA MEJOR DECISIÓN':'THERE WAS A BETTER DECISION'))+'</small><h3>'+(ok?tx(g.ok):tx(g.no))+'</h3>'+(g.unlock?(ok?'<div class="unlock">'+JOBS[g.unlock].ic+' '+(es()?'Desbloqueaste en tu Caucasia: ':'Unlocked in your Caucasia: ')+'<b>'+tx(JOBS[g.unlock])+'</b></div>':'<div class="unlock lost">🔒 '+(es()?'Este oficio no se desbloqueó en tu Caucasia.':'This job was not unlocked in your Caucasia.')+'</div>'):'')}
  r.gi++;var run=r;setTimeout(function(){if(G&&G.runner===run&&run.gate===o){run.gate=null;rm('v10Gate');var ob=document.querySelector('.objective');if(ob)ob.style.visibility=''}},3800);
}
function y3(z){var r=G.runner;return r.vp.y+(r.yb-r.vp.y)*Math.pow(Math.max(0,z),1.65)}
function laneX(lane,y){var r=G.runner,f=(y-r.vp.y)/(r.yb-r.vp.y);return r.vp.x+lane*r.spread*f}
function playerY(){var r=G.runner;return Math.min(y3(.9),C.h*.8)}
function drawCacao(){var g=X.createLinearGradient(-22,-34,22,34);g.addColorStop(0,'#ffcf6b');g.addColorStop(.5,'#d9822b');g.addColorStop(1,'#7a3d12');X.fillStyle=g;X.strokeStyle='#ffe0a0';X.lineWidth=2;X.beginPath();X.ellipse(0,0,22,36,0,0,7);X.fill();X.stroke();X.strokeStyle='rgba(90,40,10,.6)';X.lineWidth=2;for(var i=-2;i<=2;i++){X.beginPath();X.moveTo(i*7,-32);X.quadraticCurveTo(i*9,0,i*7,32);X.stroke()}}
function draw3(){
  var r=G.runner;cover(IMG[3]);X.fillStyle='rgba(0,15,22,.14)';X.fillRect(0,0,C.w,C.h);
  r.vp=ip(.5,.27);r.yb=Math.max(r.vp.y+100,ip(.5,1).y);r.spread=Math.min(CV.dw*.2,C.w*.29);
  var vp=r.vp;X.save();X.strokeStyle='rgba(125,244,255,.3)';X.lineWidth=2;[-1.5,-.5,.5,1.5].forEach(function(k){X.beginPath();X.moveTo(vp.x,vp.y);X.lineTo(vp.x+k*r.spread,r.yb);X.stroke()});
  for(var i=0;i<10;i++){var ph=(i/10+(r.distance*.02)%1)%1,y=vp.y+(r.yb-vp.y)*ph*ph,f=(y-vp.y)/(r.yb-vp.y);X.strokeStyle='rgba(111,239,255,'+(ph*.22)+')';X.lineWidth=1+ph*3;X.beginPath();X.moveTo(vp.x-1.5*r.spread*f,y);X.lineTo(vp.x+1.5*r.spread*f,y);X.stroke()}X.restore();
  r.objects.slice().sort(function(a,b){return a.z-b.z}).forEach(draw3obj);
  player3();
}
function draw3obj(o){
  var r=G.runner;if(o.z<-.02)return;var y=y3(o.z),f=(y-r.vp.y)/(r.yb-r.vp.y),x=r.vp.x+o.lane*r.spread*f,s=.16+f*1.02;
  if(o.type==='gate'){drawGate(o,y,f);return}
  X.save();X.translate(x,y);X.scale(s,s);X.lineWidth=3;X.shadowBlur=18;
  if(o.type==='plant'){X.shadowColor='#7dffb0';X.fillStyle='rgba(20,90,50,.45)';X.beginPath();X.arc(0,-6,42,0,7);X.fill();X.shadowBlur=0;if(o.kind==='cacao'){X.translate(0,-6);drawCacao()}else{X.restore();X.save();emoji(plantById(o.kind).ic,x,y-6*s,Math.max(10,58*s));X.restore();X.save()}}
  else if(o.type==='log'){X.shadowColor='#1a0b04';var lg=X.createLinearGradient(-50,0,50,0);lg.addColorStop(0,'#3d1d0b');lg.addColorStop(.5,'#a7632e');lg.addColorStop(1,'#3a1908');X.fillStyle=lg;X.strokeStyle='#df9b58';X.beginPath();X.roundRect(-52,-15,104,30,15);X.fill();X.stroke()}
  else if(o.type==='rock'){X.shadowColor='#14232b';var rg=X.createLinearGradient(-35,-35,30,30);rg.addColorStop(0,'#a2afb5');rg.addColorStop(1,'#26343d');X.fillStyle=rg;X.strokeStyle='#c5d1d5';X.beginPath();X.moveTo(-38,27);X.lineTo(-31,-12);X.lineTo(-8,-38);X.lineTo(29,-25);X.lineTo(40,20);X.lineTo(17,39);X.lineTo(-24,38);X.closePath();X.fill();X.stroke()}
  else if(o.type==='flask'){X.shadowColor='#c9d6ff';X.fillStyle='rgba(200,230,255,.28)';X.strokeStyle='#e7f3ff';X.beginPath();X.moveTo(-10,-52);X.lineTo(10,-52);X.lineTo(10,-22);X.lineTo(32,30);X.quadraticCurveTo(34,44,20,44);X.lineTo(-20,44);X.quadraticCurveTo(-34,44,-32,30);X.lineTo(-10,-22);X.closePath();X.fill();X.stroke();var mg=X.createLinearGradient(-28,10,28,44);mg.addColorStop(0,'#ffffff');mg.addColorStop(.5,'#aab6c2');mg.addColorStop(1,'#56616c');X.fillStyle=mg;X.beginPath();X.moveTo(-24,14);X.lineTo(24,14);X.lineTo(30,32);X.quadraticCurveTo(31,41,20,41);X.lineTo(-20,41);X.quadraticCurveTo(-31,41,-30,32);X.closePath();X.fill();X.fillStyle='#2b3440';X.font='900 18px '+FONT;X.textAlign='center';X.fillText('Hg',0,0)}
  else if(o.type==='smoke'){X.shadowColor='#ff9a55';for(var i=0;i<6;i++){var a=i/6*Math.PI*2+G.elapsed*.8,rr=18+8*Math.sin(G.elapsed*2+i);X.fillStyle='rgba('+(150+i*8)+','+(140+i*6)+','+(135+i*4)+',.6)';X.beginPath();X.arc(Math.cos(a)*20,-20+Math.sin(a)*14-i*4,rr,0,7);X.fill()}X.fillStyle='rgba(255,140,60,.55)';X.beginPath();X.arc(0,30,14,0,7);X.fill()}
  X.restore();
  if(f>.1){var lab=o.type==='plant'?tx(plantById(o.kind)):tx(OBST[o.type]);pill(x,y-62*s-6,lab,o.type==='plant'?'rgba(10,60,35,.88)':(o.type==='flask'||o.type==='smoke'?'rgba(90,20,15,.88)':'rgba(2,20,30,.85)'),'#ffffff',Math.round(9+4*f))}
  if(o.teach&&f>.08){var big=o.type==='plant'?(es()?'🌿 ¡RECÓGELA!':'🌿 COLLECT IT!'):(o.type==='log'||o.type==='rock')?(es()?'↑ ¡SALTA!':'↑ JUMP!'):(es()?'← → ¡CAMBIA DE CARRIL!':'← → SWITCH LANES!');pill(x,y-62*s-34,big,'#ffd35f','#1b2228',Math.round(12+5*f))}
}
function drawGate(o,y,f){
  var r=G.runner,left=r.vp.x-1.5*r.spread*f,right=r.vp.x+1.5*r.spread*f,h=150*f+20,beamY=y-h;
  X.save();X.shadowBlur=14;X.shadowColor='#000';X.fillStyle='#5a3417';X.fillRect(left-6*f,beamY,10*f+4,h);X.fillRect(right-4*f,beamY,10*f+4,h);
  var bg=X.createLinearGradient(0,beamY-24*f,0,beamY);bg.addColorStop(0,'#c58a4a');bg.addColorStop(1,'#6e4220');X.fillStyle=bg;X.fillRect(left-12*f,beamY-26*f-6,right-left+24*f,26*f+6);X.shadowBlur=0;
  X.fillStyle='#ffe9b8';X.font='900 '+Math.max(8,Math.round(16*f))+'px '+FONT;X.textAlign='center';X.textBaseline='middle';X.fillText('🪧 '+(es()?'¿QUÉ HARÍAS?':'WHAT WOULD YOU DO?'),r.vp.x,beamY-13*f-3);
  var ar=['◀','▲','▶'];
  for(var li=-1;li<=1;li++){var cx=r.vp.x+li*r.spread*f,pw=r.spread*f*.82,ph=pw*.62,py=beamY+10*f+ph/2,isOk=li===o.correctLane,cur=li===r.lane;
    if(o.hint&&isOk&&!o.checked){X.shadowBlur=o.hint===2?34:14;X.shadowColor='#ffd35f'}
    X.fillStyle=cur?'rgba(18,95,115,.95)':'rgba(3,30,42,.92)';X.strokeStyle=(o.hint&&isOk&&!o.checked)?'#ffd35f':(cur?'#8cf8ff':'rgba(255,255,255,.55)');X.lineWidth=Math.max(1.5,(o.hint===2&&isOk?5:3)*f);X.beginPath();X.roundRect(cx-pw/2,py-ph/2,pw,ph,8*f);X.fill();X.stroke();X.shadowBlur=0;
    X.fillStyle='#ffffff';X.font='900 '+Math.max(9,Math.round(34*f))+'px '+FONT;X.fillText(ar[li+1],cx,py)}
  X.restore();
}
function player3(){
  var r=G.runner,py=playerY(),x=laneX(r.visualLane,py),j=jumpH(),y=py-j,fr=j>8?3:(G.pose===4?4:(Math.floor(G.elapsed*8)%2?1:2)),a=frame(fr)||frame(0);
  X.save();X.globalAlpha=Math.max(.18,1-j/180);X.fillStyle='rgba(0,19,29,.6)';X.beginPath();X.ellipse(x,py+66,50-j*.16,12-j*.035,0,0,7);X.fill();X.restore();
  X.save();X.translate(x,y);X.rotate((r.lane-r.visualLane)*.09);X.filter='hue-rotate('+(S.color||0)+'deg) drop-shadow(0 10px 10px #00131d)';if(a)X.drawImage(a,-61,-94,122,164);X.filter='none';X.restore();
}

/* =====================================================================
   PACTO DEL GUARDIÁN, ESCENA FINAL Y CERTIFICADO
   ===================================================================== */
var PACT=[
  {ic:'♻️',es:'Separar mis residuos en blanca, verde y negra en casa.',en:'Sort my waste into white, green, and black bins at home.'},
  {ic:'🔋',es:'Llevar pilas y celulares viejos a un punto posconsumo.',en:'Take batteries and old phones to a drop-off point.'},
  {ic:'🚯',es:'No tirar basura al río ni a la orilla.',en:'Never throw trash into the river or on the riverbank.'},
  {ic:'🐟',es:'Preferir peces que no comen otros peces y preguntar dónde los pescaron.',en:'Choose fish that do not eat other fish and ask where they were caught.'},
  {ic:'🤰',es:'Contarle a mi familia por qué embarazadas y niños deben evitar los peces depredadores.',en:'Tell my family why pregnant women and children should avoid predator fish.'},
  {ic:'🏠',es:'Pedir que nunca se guarde ni se queme amalgama dentro de la casa.',en:'Ask that amalgam is never kept or burned inside the house.'},
  {ic:'🌿',es:'Compartir que existen formas de separar el oro sin mercurio.',en:'Share that there are ways to separate gold without mercury.'},
  {ic:'🐝',es:'Apoyar los productos del Bajo Cauca: miel, peces de cultivo y cacao.',en:'Support products from the Bajo Cauca: honey, farmed fish, and cocoa.'}
];
var picked=[];
function openPact(){syncS10();show('finalMission');var card=document.querySelector('#finalMission .quizCard');card.classList.add('pact-mode');var box=el('v10Pact');if(!box){box=document.createElement('div');box.id='v10Pact';card.appendChild(box)}picked=[];renderPact();tone(720,.22)}
function renderPact(){
  var box=el('v10Pact');if(!box)return;
  box.innerHTML='<div class="quizGem">🤝</div><small>'+(es()?'CIERRE DE LA MISIÓN':'MISSION FINALE')+'</small><h2>'+(es()?'Pacto del Guardián':'The Guardian’s Pact')+'</h2><p>'+(es()?'Elige 3 compromisos que cumplirás en la vida real. Quedarán escritos en tu certificado.':'Choose 3 promises you will keep in real life. They will appear on your certificate.')+'</p><div class="pactGrid">'+PACT.map(function(p,i){return '<button class="pactCard'+(picked.indexOf(i)>=0?' on':'')+'" data-i="'+i+'"><span>'+p.ic+'</span><b>'+tx(p)+'</b></button>'}).join('')+'</div><div class="pactFoot"><span>'+picked.length+' / 3</span><button class="gold" id="sealPact" '+(picked.length===3?'':'disabled')+'>'+(es()?'SELLAR MI PACTO ✍️':'SEAL MY PACT ✍️')+'</button></div>';
  box.querySelectorAll('.pactCard').forEach(function(b){b.onclick=function(){var i=+b.dataset.i,k=picked.indexOf(i);if(k>=0)picked.splice(k,1);else if(picked.length<3)picked.push(i);else{toast(es()?'Solo puedes elegir 3.':'You can only choose 3.');return}tone(620+picked.length*80,.06);renderPact()}});
  el('sealPact').onclick=function(){if(picked.length!==3)return;S10.pact=picked.slice();saveS10();S.quizPassed=true;S.total+=300;tone(980,.3);finish()};
}
leaveImpact=function(){world();if(level===3)openPact();else show('world')};
$('impactContinue').onclick=function(){leaveImpact()};

var prevFinish=finish;
finish=function(){prevFinish();syncS10();finalExtras()};
function finalExtras(){
  var rank=S.total>5200?'rank4':S.total>3600?'rank3':S.total>2000?'rank2':'rank1';$('finalRank').textContent=tr(rank);$('finalText').textContent=tr(S10.pact&&S10.pact.length?'finalGood':'finalTry');
  var b=el('v10Built');if(!b){b=document.createElement('section');b.id='v10Built';$('finalText').after(b)}
  b.innerHTML='<small>'+(es()?'LA CAUCASIA QUE CONSTRUISTE':'THE CAUCASIA YOU BUILT')+'</small><div class="jobs">'+Object.keys(JOBS).map(function(k){return '<div class="job'+(S10.jobs[k]?' on':'')+'"><span>'+(S10.jobs[k]?JOBS[k].ic:'🔒')+'</span><b>'+tx(JOBS[k])+'</b></div>'}).join('')+'</div><p class="plants">'+(es()?'Plantas que conociste: ':'Plants you discovered: ')+(PLANTS.filter(function(p){return S10.plants[p.id]}).map(function(p){return tx(p)}).join(' · ')||'—')+'</p>';
  var c=el('v10CertPact');if(!c){c=document.createElement('div');c.id='v10CertPact';document.querySelector('#certificate .certLine').before(c)}
  c.innerHTML=S10.pact&&S10.pact.length?'<small>'+(es()?'MI PACTO DEL GUARDIÁN':'MY GUARDIAN’S PACT')+'</small><ul>'+S10.pact.map(function(i){return '<li>'+PACT[i].ic+' '+tx(PACT[i])+'</li>'}).join('')+'</ul>':'';
}
function wrapText(ctx,text,x,y,maxW,lh){var words=text.split(' '),line='';for(var n=0;n<words.length;n++){var t=line+words[n]+' ';if(ctx.measureText(t).width>maxW&&n>0){ctx.fillText(line,x,y);line=words[n]+' ';y+=lh}else line=t}ctx.fillText(line,x,y);return y}
function downloadCert(){
  syncS10();var pact=(S10.pact||[]).map(function(i){return PACT[i]}),H=1100+(pact.length?260:0),c=document.createElement('canvas');c.width=1600;c.height=H;var x=c.getContext('2d'),g=x.createLinearGradient(0,0,1600,H);
  g.addColorStop(0,'#fffdf1');g.addColorStop(.55,'#e8fbff');g.addColorStop(1,'#fff1bf');x.fillStyle=g;x.fillRect(0,0,1600,H);x.strokeStyle='#c99928';x.lineWidth=18;x.strokeRect(32,32,1536,H-64);x.strokeStyle='#0c7180';x.lineWidth=4;x.strokeRect(58,58,1484,H-116);x.textAlign='center';
  x.fillStyle='#0a5264';x.font='bold 42px Georgia';x.fillText(es()?'CERTIFICADO OFICIAL DE ARCANIS':'OFFICIAL ARCANIS CERTIFICATE',800,170);x.font='bold 78px Georgia';x.fillText(es()?'GUARDIÁN DE LOS RÍOS':'GUARDIAN OF THE RIVERS',800,275);
  x.fillStyle='#8b671b';x.font='34px Georgia';x.fillText(es()?'Se reconoce a':'This certificate recognizes',800,370);x.fillStyle='#9a4e16';x.font='italic bold 88px Georgia';x.fillText(S.name,800,500);x.strokeStyle='#bf9124';x.lineWidth=3;x.beginPath();x.moveTo(280,535);x.lineTo(1320,535);x.stroke();
  x.fillStyle='#294750';x.font='32px Georgia';var yy=wrapText(x,tr('certBody'),800,610,1150,46);
  x.fillStyle='#0a6677';x.font='bold 40px Arial';x.fillText($('finalRank').textContent,800,yy+85);x.fillStyle='#bc861a';x.font='bold 36px Arial';x.fillText(S.total+' PTS  ·  ★ '+(S.badges||[]).length,800,yy+140);
  if(pact.length){var py=yy+215;x.fillStyle='#0a5264';x.font='bold 34px Georgia';x.fillText(es()?'MI PACTO DEL GUARDIÁN':'MY GUARDIAN’S PACT',800,py);x.font='28px Arial';x.fillStyle='#294750';pact.forEach(function(p,i){x.fillText('✓  '+tx(p),800,py+55+i*48)})}
  x.fillStyle='#566e73';x.font='26px Arial';x.fillText($('certificateDate').textContent,800,H-145);x.font='bold 29px Arial';x.fillText('ARCANIS · CRYSTAL OF RIVERS',800,H-85);
  var a=document.createElement('a');a.href=c.toDataURL('image/png');a.download='Certificado-Arcanis-'+S.name.replace(/[^a-z0-9_-]/gi,'-')+'.png';document.body.appendChild(a);a.click();a.remove();toast(es()?'Certificado descargado':'Certificate downloaded');
}
$('downloadCertificate').onclick=downloadCert;

/* ---------- conexiones con el resto del juego ---------- */
var prevStart=start;
start=function(){var n=$('nameInput').value.trim();prevStart();if(n){S10={jobs:{},plants:{},pact:[],seen:{},name:S.name};saveS10()}};
$('beginBtn').onclick=function(){start()};
$('launchBtn').onclick=openLearn;
$('exitBtn').addEventListener('click',function(){cleanup();rm('v10Feedback')});
var prevApply=applyLang;
applyLang=function(){prevApply();if(el('v10Learn'))renderLearn();if(el('v10Pact')&&$('finalMission').classList.contains('active'))renderPact();if($('final').classList.contains('active'))finalExtras();if(G&&G.run&&G.l1)buildBins();if(G&&G.run&&G.l2){updDiner();updVision()}if(el('v10Report'))renderReport();if(G&&G.run&&G.runner&&G.runner.gate&&!G.runner.gate.checked)renderGatePanel(G.runner.gate)};
addEventListener('resize',function(){var p=el('v10Gate');if(p)placeLikeObjective(p)});
applyLang();
})();
