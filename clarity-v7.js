/* Arcanis V7 — onboarding and control reliability */
(function(){
  'use strict';
  var actualLaunch=launch,tutorialOpen=false;
  var COPY={
    es:{
      label:'ANTES DE COMENZAR',start:'ENTENDIDO · COMENZAR',close:'VOLVER',
      1:{title:'Tormenta de residuos',intro:'Atrapa los residuos que caen para limpiar el río. Los residuos que se escapen no quitan vidas: solo perderás una vida si atrapas un pez.',steps:[['↔️','Muévete','Usa ← →, A/D o los botones.'],['🗑️','Atrapa residuos','Colócate debajo de botellas, bolsas y latas.'],['🐟','Protege los peces','No los atrapes: ellos pertenecen al río.']],go:'Muévete y atrapa residuos. ¡Evita todos los peces!'},
      2:{title:'Defensa del río',intro:'Las amenazas están visibles y avanzan hacia el núcleo azul. Tócalas antes de que lleguen, pero protege los elementos saludables.',steps:[['🎯','Toca amenazas','Mercurio, barriles, minería y contaminación.'],['🌿','Protege la vida','No toques hojas, patos, tortugas ni agua limpia.'],['⚡','Usa Purificación','Cuando marque 100%, pulsa el botón central.']],go:'Toca las amenazas visibles antes de que alcancen el núcleo azul.'},
      3:{title:'Carrera por el río Cauca',intro:'Tu Guardián corre automáticamente por el puente sobre el río Cauca. Cambia entre tres carriles y salta en el momento correcto para alcanzar el portal final.',steps:[['↔️','Cambia de carril','Usa ← →, A/D, botones o desliza.'],['⬆️','Salta','Usa ↑, W, ESPACIO, el botón o desliza arriba.'],['💎','Recoge cristales','Esquiva tóxicos, portones y remolinos.']],go:'¡La carrera comenzó! Cambia de carril y salta los obstáculos.'}
    },
    en:{
      label:'BEFORE YOU START',start:'GOT IT · START',close:'BACK',
      1:{title:'Waste storm',intro:'Catch falling waste to clean the river. Missed waste does not cost a life: you only lose one if you catch a fish.',steps:[['↔️','Move','Use ← →, A/D, or the buttons.'],['🗑️','Catch waste','Stand below bottles, bags, and cans.'],['🐟','Protect fish','Do not catch them: they belong in the river.']],go:'Move and catch waste. Avoid every fish!'},
      2:{title:'River defense',intro:'Visible threats move toward the blue core. Tap them before they arrive, but protect every healthy element.',steps:[['🎯','Tap threats','Mercury, barrels, mining, and pollution.'],['🌿','Protect life','Do not tap leaves, ducks, turtles, or clean water.'],['⚡','Use Purification','When it reaches 100%, press the center button.']],go:'Tap visible threats before they reach the blue core.'},
      3:{title:'Race along the Cauca River',intro:'Your Guardian runs automatically across the bridge over the Cauca River. Switch between three lanes and jump at the right time to reach the final portal.',steps:[['↔️','Switch lanes','Use ← →, A/D, buttons, or swipe.'],['⬆️','Jump','Use ↑, W, SPACE, the button, or swipe up.'],['💎','Collect crystals','Dodge toxins, gates, and whirlpools.']],go:'The run has begun! Switch lanes and jump over obstacles.'}
    }
  };

  function openTutorial(){
    if(tutorialOpen)return;tutorialOpen=true;var c=COPY[lang],q=c[level],layer=document.createElement('div');layer.className='levelTutorial';layer.id='levelTutorial';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.innerHTML='<article><button class="tutorialClose" aria-label="'+c.close+'">×</button><img class="tutorialAvatar" src="'+avatarURL()+'" style="filter:hue-rotate('+(S.color||0)+'deg)"><small>'+c.label+' · '+(lang==='es'?'NIVEL ':'LEVEL ')+level+'</small><h2>'+q.title+'</h2><p>'+q.intro+'</p><div class="tutorialSteps">'+q.steps.map(function(s){return '<div class="tutorialStep"><span>'+s[0]+'</span><b>'+s[1]+'</b><em>'+s[2]+'</em></div>'}).join('')+'</div><button class="gold tutorialStart">'+c.start+' ▶</button></article>';document.body.appendChild(layer);layer.querySelector('.tutorialClose').onclick=function(){closeTutorial()};layer.querySelector('.tutorialStart').onclick=function(){closeTutorial();beginLevel()};layer.querySelector('.tutorialStart').focus();tone(620,.12)
  }
  function closeTutorial(){var e=$('levelTutorial');if(e)e.remove();tutorialOpen=false}
  function beginLevel(){
    actualLaunch();setupVisibleControls();var text=COPY[lang][level].go;setTimeout(function(){if(!$('game').classList.contains('active'))return;showStartFeedback(text)},2750);setTimeout(function(){if($('game').classList.contains('active')&&G&&!G.run&&G.lives>0){G.run=true;last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}},3900)
  }
  function setupVisibleControls(){
    var old=$('controlDock');if(old)old.remove();var dock=document.createElement('div');dock.id='controlDock';dock.className='controlDock';var html='';if(level===1)html='<kbd>←</kbd><kbd>→</kbd><span>'+(lang==='es'?'MOVER · ATRAPAR RESIDUOS':'MOVE · CATCH WASTE')+'</span>';if(level===2)html='<kbd>CLIC</kbd><kbd>⚡</kbd><span>'+(lang==='es'?'TOCAR AMENAZAS · PURIFICAR':'TAP THREATS · PURIFY')+'</span>';if(level===3)html='<kbd>←</kbd><kbd>↑</kbd><kbd>→</kbd><span>'+(lang==='es'?'CARRIL · SALTO · CARRIL':'LANE · JUMP · LANE')+'</span>';dock.innerHTML=html;$('canvasWrap').appendChild(dock);$('leftBtn').setAttribute('aria-label',lang==='es'?'Mover a la izquierda':'Move left');$('rightBtn').setAttribute('aria-label',lang==='es'?'Mover a la derecha':'Move right');$('powerBtn').setAttribute('aria-label',level===3?(lang==='es'?'Saltar':'Jump'):(lang==='es'?'Activar poder':'Activate power'))
  }
  function showStartFeedback(text){var old=$('startFeedback');if(old)old.remove();var e=document.createElement('div');e.id='startFeedback';e.className='startFeedback';e.textContent=text;$('canvasWrap').appendChild(e);void e.offsetWidth;e.classList.add('show');setTimeout(function(){e.remove()},3500)}
  function pulseKey(key){if(!$('game').classList.contains('active')||!G||!G.run)return;keys[key]=1;setTimeout(function(){keys[key]=0},190)}

  $('launchBtn').onclick=openTutorial;
  $('leftBtn').addEventListener('click',function(){pulseKey('ArrowLeft')});
  $('rightBtn').addEventListener('click',function(){pulseKey('ArrowRight')});
  $('exitBtn').addEventListener('click',function(){closeTutorial();['controlDock','startFeedback'].forEach(function(id){var e=$(id);if(e)e.remove()})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&tutorialOpen)closeTutorial()});
})();
