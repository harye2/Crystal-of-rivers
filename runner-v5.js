/* Arcanis V5 — Level 3 becomes a three-lane obstacle runner */
(function(){
  'use strict';
  Object.assign(T.es,{l3title:'Carrera por el río Cauca',l3sub:'Corre por el puente, cambia de carril y salta obstáculos.',brief3:'El puente sobre el río Cauca está lleno de obstáculos. Tu Guardián correrá automáticamente: cambia entre tres carriles, salta troncos y rocas, esquiva tóxicos y remolinos, y llega al portal final.',obj3:'CRUZA EL PUENTE DEL CAUCA',obj3b:'← → cambia de carril · ↑ o ESPACIO salta · En celular usa los tres botones.',bonus3:'Especial: recoge 12 cristales en la carrera',shield:'¡SALTO PERFECTO!'});
  Object.assign(T.en,{l3title:'Race along the Cauca River',l3sub:'Run across the bridge, switch lanes, and jump over obstacles.',brief3:'The bridge over the Cauca River is filled with obstacles. Your Guardian runs automatically: switch between three lanes, jump over logs and rocks, dodge toxins and whirlpools, and reach the final portal.',obj3:'CROSS THE CAUCA BRIDGE',obj3b:'← → switches lanes · ↑ or SPACE jumps · On your phone, use the three buttons.',bonus3:'Special: collect 12 crystals during the run',shield:'PERFECT JUMP!'});
  L[3].rules=[['🏃','Corre automáticamente / Auto run'],['↔️','Cambia de carril / Switch lanes'],['⬆️','Salta obstáculos / Jump obstacles']];
  if(typeof D!=='undefined'){
    D.es.before3=function(n){return n+', llegó la carrera final por el río Cauca. Yo correré automáticamente: muéveme entre los tres carriles y hazme saltar para superar los obstáculos del puente.'};
    D.en.before3=function(n){return n+', the final race along the Cauca River is here. I will run automatically: move me across the three lanes and make me jump over the bridge obstacles.'};
    D.es.level3=function(n){return '¡Qué carrera, '+n+'! Cruzamos el puente sobre el río Cauca y llegamos al portal final. El Cristal de los Ríos está casi restaurado.'};
    D.en.level3=function(n){return 'What a run, '+n+'! We crossed the bridge over the Cauca River and reached the final portal. The Crystal of Rivers is almost restored.'};
  }

  var runnerFrames={boy:[],girl:[]};
  ['boy','girl'].forEach(function(g){for(var i=0;i<8;i++){var im=new Image();im.src='assets/avatar-'+g+'-frame-'+i+'.webp';runnerFrames[g].push(im)}});
  var previousLaunch=launch,previousDraw=draw,swipeStart=null;
  var previousEnd=end;

  launch=function(){
    previousLaunch();
    document.body.classList.toggle('runner-mode',level===3);
    removeRunnerUI();
    if(level!==3)return;
    var mode=S.difficulty||'normal',settings=mode==='easy'?{goal:650,time:86}:mode==='hard'?{goal:950,time:76}:{goal:800,time:80};
    G.goal=settings.goal;G.time=settings.time;G.found=0;G.p.x=C.w/2;G.p.vx=0;G.p.power=0;G.p.shield=0;
    G.runner={lane:0,visualLane:0,distance:0,jumpTime:0,jumpDuration:.92,spawn:.55,controlLock:0,crystals:0,speed:11.5,objects:[],passed:0};
    G.bonus={value:0,target:12,done:false};
    $('objectiveTitle').textContent=(lang==='es'?'CORRE ':'RUN ')+G.goal+' m';$('objectiveText').textContent=tr('obj3b');$('bonusTitle').textContent=tr('bonus3');$('bonusProgress').textContent='0 / 12';$('powerBtn').textContent='⬆️';$('powerBtn').classList.remove('ready','cooldown');
    addRunnerUI();hud();
  };

  function addRunnerUI(){
    var hint=document.createElement('div');hint.className='runnerHint';hint.id='runnerHint';hint.textContent=lang==='es'?'← → CAMBIA DE CARRIL  ·  ↑ SALTA':'← → SWITCH LANES  ·  ↑ JUMP';$('canvasWrap').appendChild(hint);
    var speed=document.createElement('div');speed.className='runnerSpeed';speed.id='runnerSpeed';speed.textContent='x1.0';$('canvasWrap').appendChild(speed)
  }
  function removeRunnerUI(){['runnerHint','runnerSpeed'].forEach(function(id){var e=$(id);if(e)e.remove()})}

  up3=function(dt){
    var r=G.runner;if(!r)return;
    r.controlLock=Math.max(0,r.controlLock-dt);if(r.controlLock<=0){if(keys.ArrowLeft||keys.a){changeLane(-1);r.controlLock=.23}else if(keys.ArrowRight||keys.d){changeLane(1);r.controlLock=.23}}
    r.jumpTime=Math.max(0,r.jumpTime-dt);r.speed=Math.min(19.5,11.5+G.elapsed*.055);r.distance+=r.speed*dt;G.found=Math.min(G.goal,Math.floor(r.distance));
    r.spawn-=dt;if(r.spawn<=0){spawnRunnerWave();r.spawn=Math.max(.38,.78-G.elapsed*.0035)}
    for(var i=0;i<r.objects.length;i++){var o=r.objects[i];o.z+=dt*(.35+r.speed*.013);if(!o.checked&&o.z>.81){o.checked=true;checkRunnerCollision(o)}if(o.z>1.2)o.dead=true}
    r.objects=r.objects.filter(function(o){return !o.dead});r.visualLane+=(r.lane-r.visualLane)*Math.min(1,dt*11);if($('runnerSpeed'))$('runnerSpeed').textContent='x'+(r.speed/11.5).toFixed(1);updateRunnerProgress();
  };

  function changeLane(direction){var r=G.runner,next=Math.max(-1,Math.min(1,r.lane+direction));if(next!==r.lane){r.lane=next;G.pose=direction<0?1:2;G.poseUntil=performance.now()+260;tone(390,.055)}}
  function jump(){if(level!==3||!G||!G.run||!G.runner)return;if(G.runner.jumpTime>0)return;G.runner.jumpTime=G.runner.jumpDuration;G.pose=3;G.poseUntil=performance.now()+G.runner.jumpDuration*1000;tone(650,.09);setTimeout(function(){tone(820,.07)},80)}
  power=function(){if(level===3){jump();return}if(level===2&&G&&G.run){if(G.scanCooldown>0)return;G.scan=2.6;G.scanCooldown=4.4;$('scanPulse').classList.remove('active');void $('scanPulse').offsetWidth;$('scanPulse').classList.add('active');msg(tr('scanReady'));tone(780,.24)}};

  function spawnRunnerWave(){
    var r=G.runner,roll=Math.random(),lanes=[-1,0,1];
    if(roll<.46){var lane=lanes[Math.floor(Math.random()*3)];r.objects.push(makeRunnerObject('crystal',lane,0));if(Math.random()<.38)r.objects.push(makeRunnerObject('crystal',lane,-.18))}
    else if(roll<.82){var types=['log','rock','barrel','whirlpool','gate'],type=types[Math.floor(Math.random()*types.length)];r.objects.push(makeRunnerObject(type,lanes[Math.floor(Math.random()*3)],0))}
    else{var safe=lanes.splice(Math.floor(Math.random()*3),1)[0];lanes.forEach(function(lane){r.objects.push(makeRunnerObject(Math.random()<.5?'rock':'barrel',lane,0))});r.objects.push(makeRunnerObject('crystal',safe,-.13))}
  }
  function makeRunnerObject(type,lane,z){return{type:type,lane:lane,z:z||0,checked:false,dead:false,phase:Math.random()*6,spin:Math.random()*6}}
  function jumpHeight(){var r=G.runner;if(!r||r.jumpTime<=0)return 0;var progress=(r.jumpDuration-r.jumpTime)/r.jumpDuration;return Math.sin(progress*Math.PI)*118}
  function checkRunnerCollision(o){
    var r=G.runner;if(o.lane!==r.lane)return;
    if(o.type==='crystal'){collectRunnerCrystal(o);return}
    var canJump=o.type==='log'||o.type==='rock',air=jumpHeight()>48;
    if(canJump&&air){r.passed++;G.score+=35;G.combo=Math.min(9,G.combo+1);G.best=Math.max(G.best,G.combo);burst(runnerX(o.lane,.88),C.h*.76-jumpHeight(),'#ffe477');tone(870,.07);return}
    o.dead=true;G.attempts++;bad(runnerX(o.lane,.88),C.h*.72)
  }
  function collectRunnerCrystal(o){o.dead=true;var r=G.runner;r.crystals++;G.hits++;G.attempts++;G.combo=Math.min(9,G.combo+1);G.best=Math.max(G.best,G.combo);G.score+=25*G.combo;G.pose=3;G.poseUntil=performance.now()+220;burst(runnerX(o.lane,.88),C.h*.72-jumpHeight(),'#5af4ff');tone(620+G.combo*35,.08);runnerBonus()}
  function runnerBonus(){var b=G.bonus;if(!b||b.done)return;b.value=G.runner.crystals;$('bonusProgress').textContent=Math.min(b.value,b.target)+' / '+b.target;if(b.value>=b.target){b.done=true;G.score+=350;$('bonusProgress').textContent='✓';msg(lang==='es'?'¡MISIÓN ESPECIAL COMPLETADA! +350':'SPECIAL MISSION COMPLETE! +350');tone(1120,.25);setTimeout(function(){tone(1380,.22)},170)}}
  function updateRunnerProgress(){$('objectiveBar').style.width=Math.min(100,G.found/G.goal*100)+'%';$('objectiveCount').textContent=G.found+' / '+G.goal+' m'}

  draw=function(){if(level!==3||!G||!G.runner){previousDraw();return}drawRunner()};
  function drawRunner(){
    var w=C.w,h=C.h,r=G.runner,shake=G.shake||0;X.save();X.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);if(IMG[3].complete)X.drawImage(IMG[3],0,0,w,h);else{X.fillStyle='#062938';X.fillRect(0,0,w,h)}
    var horizon=h*.22;X.fillStyle='rgba(0,20,28,.22)';X.fillRect(0,0,w,h);var path=X.createLinearGradient(0,horizon,0,h);path.addColorStop(0,'rgba(67,188,190,.12)');path.addColorStop(.48,'rgba(10,80,92,.34)');path.addColorStop(1,'rgba(0,20,29,.68)');X.fillStyle=path;X.beginPath();X.moveTo(w*.47,horizon);X.lineTo(w*.91,h);X.lineTo(w*.09,h);X.lineTo(w*.53,horizon);X.closePath();X.fill();
    X.strokeStyle='rgba(125,244,255,.25)';X.lineWidth=2;[-.5,.5].forEach(function(side){X.beginPath();X.moveTo(w*.5+side*w*.025,horizon);X.lineTo(w*.5+side*w*.55,h);X.stroke()});
    for(var i=0;i<10;i++){var phase=(i/10+(G.elapsed*r.speed*.018)%1)%1,y=horizon+(h-horizon)*phase*phase;X.strokeStyle='rgba(111,239,255,'+(phase*.24)+')';X.lineWidth=1+phase*3;X.beginPath();X.moveTo(w*.5-w*.38*phase,y);X.lineTo(w*.5+w*.38*phase,y);X.stroke()}
    r.objects.slice().sort(function(a,b){return a.z-b.z}).forEach(drawRunnerObject);drawRunnerPlayer();G.parts.forEach(function(p){X.globalAlpha=Math.max(0,p.life);X.fillStyle=p.c;X.beginPath();X.arc(p.x,p.y,p.s,0,7);X.fill()});X.globalAlpha=1;X.restore()
  }
  function runnerX(lane,z){return C.w*.5+lane*(C.w*.055+C.w*.26*Math.max(0,z))}
  function runnerY(z){var hz=C.h*.22,v=Math.max(0,z);return hz+(C.h-hz)*Math.pow(v,1.65)}
  function drawRunnerObject(o){
    if(o.z<-.02)return;var x=runnerX(o.lane,o.z),y=runnerY(o.z),s=.22+o.z*1.05;X.save();X.translate(x,y);X.scale(s,s);X.rotate(o.type==='crystal'?G.elapsed*2.7:Math.sin(G.elapsed+o.phase)*.045);X.lineWidth=3;X.shadowBlur=18;
    if(o.type==='crystal'){X.shadowColor='#42efff';var cg=X.createLinearGradient(-22,-35,22,35);cg.addColorStop(0,'#efffff');cg.addColorStop(.35,'#45efff');cg.addColorStop(1,'#3867db');X.fillStyle=cg;X.strokeStyle='#d8ffff';X.beginPath();X.moveTo(0,-38);X.lineTo(25,-8);X.lineTo(11,31);X.lineTo(0,40);X.lineTo(-17,28);X.lineTo(-26,-8);X.closePath();X.fill();X.stroke()}
    else if(o.type==='log'){X.shadowColor='#1a0b04';var lg=X.createLinearGradient(-48,0,48,0);lg.addColorStop(0,'#3d1d0b');lg.addColorStop(.5,'#a7632e');lg.addColorStop(1,'#3a1908');X.fillStyle=lg;X.strokeStyle='#df9b58';X.beginPath();X.roundRect(-52,-15,104,30,15);X.fill();X.stroke();X.strokeStyle='#5e2e13';X.beginPath();X.arc(44,0,12,0,7);X.stroke()}
    else if(o.type==='rock'){X.shadowColor='#14232b';var rg=X.createLinearGradient(-35,-35,30,30);rg.addColorStop(0,'#a2afb5');rg.addColorStop(1,'#26343d');X.fillStyle=rg;X.strokeStyle='#c5d1d5';X.beginPath();X.moveTo(-38,27);X.lineTo(-31,-12);X.lineTo(-8,-38);X.lineTo(29,-25);X.lineTo(40,20);X.lineTo(17,39);X.lineTo(-24,38);X.closePath();X.fill();X.stroke()}
    else if(o.type==='barrel'){X.shadowColor='#ff633f';X.fillStyle='#6f281f';X.strokeStyle='#ff9c62';X.beginPath();X.roundRect(-30,-46,60,92,8);X.fill();X.stroke();X.fillStyle='#e79825';X.fillRect(-28,-29,56,11);X.fillRect(-28,21,56,11);X.fillStyle='#ffe26b';X.beginPath();X.moveTo(0,-12);X.lineTo(18,18);X.lineTo(-18,18);X.closePath();X.fill()}
    else if(o.type==='whirlpool'){X.shadowColor='#43eaff';for(var i=0;i<5;i++){X.strokeStyle='rgba(80,235,255,'+(1-i*.15)+')';X.lineWidth=6-i;X.beginPath();X.arc(0,0,13+i*9,i*.7,Math.PI*1.7+i*.7);X.stroke()}}
    else{X.shadowColor='#ffb84e';X.fillStyle='#66401d';X.strokeStyle='#ffd78b';X.fillRect(-47,-54,94,108);X.strokeRect(-47,-54,94,108);X.fillStyle='#e9a331';X.fillRect(-38,-44,76,17);X.fillRect(-38,-7,76,17);X.fillRect(-38,30,76,17);X.fillStyle='#241409';X.fillRect(-9,-54,18,108)}X.restore()
  }
  function drawRunnerPlayer(){
    var r=G.runner,x=runnerX(r.visualLane,.93),jump=jumpHeight(),y=C.h*.79-jump,frame=jump>8?3:(Math.floor(G.elapsed*8)%2?1:2),a=runnerFrames[S.gender]&&runnerFrames[S.gender][frame];X.save();X.globalAlpha=Math.max(.18,1-jump/180);X.fillStyle='#00131d99';X.beginPath();X.ellipse(x,C.h*.9,52-jump*.16,13-jump*.035,0,0,7);X.fill();X.restore();X.save();X.translate(x,y);X.rotate((r.lane-r.visualLane)*.09);X.shadowBlur=24;X.shadowColor='#48ecff';X.filter='hue-rotate('+(S.color||0)+'deg) drop-shadow(0 10px 10px #00131d)';if(a&&a.complete)X.drawImage(a,-61,-94,122,164);X.filter='none';X.restore()
  }

  $('powerBtn').onclick=power;
  end=function(win){if(level===3){document.body.classList.remove('runner-mode');removeRunnerUI()}previousEnd(win)};
  document.addEventListener('keydown',function(e){if(level===3&&G&&G.run&&(e.key==='ArrowUp'||e.key==='w'||e.key==='W')){e.preventDefault();jump()}});
  C.addEventListener('pointerdown',function(e){if(level===3)swipeStart={x:e.clientX,y:e.clientY}});
  C.addEventListener('pointerup',function(e){if(level!==3||!swipeStart)return;var dx=e.clientX-swipeStart.x,dy=e.clientY-swipeStart.y;swipeStart=null;if(Math.abs(dx)>36&&Math.abs(dx)>Math.abs(dy))changeLane(dx<0?-1:1);else if(dy<-30)jump()});
  $('exitBtn').addEventListener('click',function(){document.body.classList.remove('runner-mode');removeRunnerUI()});
  applyLang();
})();
