/* Arcanis V6 — repaired runner launch and redesigned Level 2 */
(function(){
  'use strict';
  Object.assign(T.es,{l2title:'Defensa del río',l2sub:'Detén las amenazas antes de que alcancen el agua.',brief2:'La contaminación avanza hacia el corazón del río. Las amenazas ahora son totalmente visibles: tócalas antes de que alcancen el núcleo azul, protege los animales y carga la Purificación para limpiar una oleada completa.',obj2:'DEFIENDE EL NÚCLEO DEL RÍO',obj2b:'Toca solo amenazas visibles. Si una llega al núcleo, perderás una vida. No ataques animales ni plantas.',bonus2:'Especial: elimina 5 amenazas seguidas',scanHint:'Toca las amenazas antes de que lleguen al núcleo.',scanReady:'¡PURIFICACIÓN DISPONIBLE!'});
  Object.assign(T.en,{l2title:'River defense',l2sub:'Stop threats before they reach the water.',brief2:'Pollution is closing in on the heart of the river. Every threat is now fully visible: tap it before it reaches the blue core, protect wildlife, and charge Purification to clear a whole wave.',obj2:'DEFEND THE RIVER CORE',obj2b:'Tap visible threats only. If one reaches the core, you lose a life. Do not attack animals or plants.',bonus2:'Special: remove 5 threats in a row',scanHint:'Tap threats before they reach the core.',scanReady:'PURIFICATION READY!'});
  L[2].rules=[['🎯','Toca amenazas / Tap threats'],['💙','Protege el núcleo / Protect the core'],['⚡','Carga Purificación / Charge Purification']];
  if(typeof D!=='undefined'){
    D.es.before2=function(n){return n+', ya no necesitamos escáner. Todas las amenazas serán visibles. Deténlas antes de que lleguen al núcleo azul y no toques los animales ni las plantas.'};
    D.en.before2=function(n){return n+', we no longer need a scanner. Every threat will be visible. Stop it before it reaches the blue core, and do not tap animals or plants.'};
  }

  var priorLaunch=launch,priorPower=power,priorTap=tap,priorDraw=draw,priorEnd=end;

  launch=function(){
    priorLaunch();
    document.body.classList.toggle('defense-mode',level===2);removeDefenseUI();
    if(level!==2)return;
    var mode=S.difficulty||'normal',settings=mode==='easy'?{goal:14,time:76,lives:4}:mode==='hard'?{goal:22,time:67,lives:3}:{goal:18,time:72,lives:3};
    G.goal=settings.goal;G.time=settings.time;G.lives=settings.lives;G.found=0;G.scan=9999;G.scanCooldown=0;G.objs=[];G.spawn=.7;
    G.defense={coreX:C.w*.5,coreY:C.h*.59,power:0,streak:0,maxStreak:0,wave:1,aimX:C.w*.5,aimY:C.h*.5};G.bonus={value:0,target:5,done:false};
    $('objectiveTitle').textContent=(lang==='es'?'DEFIENDE EL RÍO · ':'DEFEND THE RIVER · ')+G.goal;$('objectiveText').textContent=tr('obj2b');$('bonusTitle').textContent=tr('bonus2');$('bonusProgress').textContent='0 / 5';updateDefenseButton();addDefenseUI();hud();
  };

  function addDefenseUI(){var a=document.createElement('div');a.id='defenseLabel';a.className='defenseLabel';a.textContent=lang==='es'?'AMENAZAS VISIBLES · PROTEGE LA NATURALEZA':'VISIBLE THREATS · PROTECT NATURE';$('canvasWrap').appendChild(a);var c=document.createElement('div');c.id='coreLabel';c.className='coreLabel';c.textContent=lang==='es'?'NÚCLEO DEL RÍO':'RIVER CORE';$('canvasWrap').appendChild(c)}
  function removeDefenseUI(){['defenseLabel','coreLabel'].forEach(function(id){var e=$(id);if(e)e.remove()})}

  up2=function(dt){
    var d=G.defense;if(!d)return;d.coreX=C.w*.5;d.coreY=C.h*.59;
    if(G.spawn<=0){spawnDefenseThreat();if(G.elapsed>18&&Math.random()<.27)spawnDefenseThreat();d.wave=1+Math.floor(G.elapsed/18);G.spawn=Math.max(.42,.92-G.elapsed*.006)}
    G.objs.forEach(function(o){o.x+=o.vx*dt;o.y+=o.vy*dt;o.phase+=dt;o.spin+=dt*1.8;var distance=Math.hypot(o.x-d.coreX,o.y-d.coreY);if(distance<35&&!o.dead){o.dead=true;o.type==='danger'?damageCore(o):protectArrival(o)}});G.objs=G.objs.filter(function(o){return !o.dead});updateDefenseButton()
  };
  function spawnDefenseThreat(){
    var d=G.defense,danger=Math.random()<.72,dangers=['mercury','barrel','mine','fishbad','pipe','dredge'],safe=['leaf','duck','water','turtle'],side=Math.floor(Math.random()*3),x,y;if(side===0){x=55+Math.random()*(C.w-110);y=150}else if(side===1){x=40;y=175+Math.random()*(C.h-235)}else{x=C.w-40;y=175+Math.random()*(C.h-235)}var dx=d.coreX-x,dy=d.coreY-y,len=Math.max(1,Math.hypot(dx,dy)),speed=30+G.elapsed*.28+Math.random()*17;G.objs.push({type:danger?'danger':'safe',variant:(danger?dangers:safe)[Math.floor(Math.random()*(danger?dangers:safe).length)],x:x,y:y,r:32,vx:dx/len*speed,vy:dy/len*speed,life:20,phase:Math.random()*6,spin:Math.random()*6})
  }
  function damageCore(o){var now=performance.now();if(G.lastDamage&&now-G.lastDamage<650)return;G.lastDamage=now;G.lives--;G.combo=1;G.shake=13;G.defense.streak=0;G.bonus.value=0;$('bonusProgress').textContent='0 / 5';burst(o.x,o.y,'#ff5a66');tone(145,.2);msg(lang==='es'?'⚠️ ¡Una amenaza alcanzó el río!':'⚠️ A threat reached the river!');flashHit()}
  function protectArrival(o){G.score+=5;burst(o.x,o.y,'#5cf0ad')}
  function flashHit(){$('flash').classList.remove('hit');void $('flash').offsetWidth;$('flash').classList.add('hit')}

  tap=function(x,y){
    if(level!==2||!G||!G.run||!G.defense){priorTap(x,y);return}G.defense.aimX=x;G.defense.aimY=y;var o=G.objs.slice().reverse().find(function(a){return Math.hypot(a.x-x,a.y-y)<a.r*1.65});if(!o){tone(260,.045);return}o.dead=true;G.attempts++;
    if(o.type==='danger'){good(o.x,o.y,17);G.defense.streak++;G.defense.maxStreak=Math.max(G.defense.maxStreak,G.defense.streak);G.defense.power=Math.min(100,G.defense.power+17);defenseBonus();burst(o.x,o.y,'#ffd85d')}else{G.defense.streak=0;G.bonus.value=0;$('bonusProgress').textContent='0 / 5';bad(o.x,o.y)}
  };
  function defenseBonus(){var b=G.bonus;if(!b||b.done)return;b.value=G.defense.streak;$('bonusProgress').textContent=Math.min(b.value,b.target)+' / '+b.target;if(b.value>=b.target){b.done=true;G.score+=350;$('bonusProgress').textContent='✓';msg(lang==='es'?'¡RACHA PERFECTA! +350':'PERFECT STREAK! +350');tone(1100,.25)}}
  function updateDefenseButton(){if(!G||!G.defense)return;var ready=G.defense.power>=100;$('powerBtn').textContent=ready?(lang==='es'?'⚡ LIMPIAR':'⚡ CLEAR'):'⚡ '+Math.floor(G.defense.power)+'%';$('powerBtn').classList.toggle('ready',ready);$('powerBtn').classList.remove('cooldown')}
  power=function(){
    if(level!==2){priorPower();return}if(!G||!G.run||!G.defense||G.defense.power<100)return;G.defense.power=0;var targets=G.objs.filter(function(o){return o.type==='danger'}).sort(function(a,b){return b.y-a.y}).slice(0,3);targets.forEach(function(o,i){setTimeout(function(){if(o.dead)return;o.dead=true;G.attempts++;good(o.x,o.y,14);G.defense.streak++;defenseBonus();burst(o.x,o.y,'#fff08a')},i*90)});msg(lang==='es'?'⚡ ¡OLEADA PURIFICADA!':'⚡ WAVE PURIFIED!');tone(980,.3);updateDefenseButton()
  };

  draw=function(){priorDraw();if(level===2&&G&&G.defense)drawDefenseOverlay()};
  function drawDefenseOverlay(){var d=G.defense,t=G.elapsed||0;X.save();X.translate(d.coreX,d.coreY);X.globalCompositeOperation='lighter';for(var i=0;i<3;i++){X.strokeStyle='rgba(82,238,255,'+(.5-i*.12)+')';X.lineWidth=3-i*.6;X.beginPath();X.arc(0,0,27+i*11+Math.sin(t*4+i)*4,0,7);X.stroke()}var g=X.createRadialGradient(0,0,2,0,0,30);g.addColorStop(0,'#fff');g.addColorStop(.25,'#74f5ff');g.addColorStop(1,'#1b86c800');X.fillStyle=g;X.beginPath();X.arc(0,0,31,0,7);X.fill();X.restore();X.save();X.translate(d.aimX,d.aimY);X.strokeStyle='#ffdd70aa';X.lineWidth=2;X.beginPath();X.arc(0,0,18+Math.sin(t*6)*2,0,7);X.moveTo(-27,0);X.lineTo(-10,0);X.moveTo(27,0);X.lineTo(10,0);X.moveTo(0,-27);X.lineTo(0,-10);X.moveTo(0,27);X.lineTo(0,10);X.stroke();X.restore()}

  end=function(win){if(level===2){document.body.classList.remove('defense-mode');removeDefenseUI()}priorEnd(win)};
  C.addEventListener('pointermove',function(e){if(level===2&&G&&G.defense){var r=C.getBoundingClientRect();G.defense.aimX=e.clientX-r.left;G.defense.aimY=e.clientY-r.top}});
  $('launchBtn').onclick=launch;
  $('powerBtn').onclick=power;
  applyLang();
})();
