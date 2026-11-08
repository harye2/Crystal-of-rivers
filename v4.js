/* Arcanis V4 — deeper gameplay, animated avatars, save system and final challenge */
(function(){
  'use strict';
  if(window.CanvasRenderingContext2D&&!CanvasRenderingContext2D.prototype.roundRect){CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.min(+r||0,Math.abs(w)/2,Math.abs(h)/2);this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();return this}};
  var SAVE_KEY='arcanisCrystalV4';
  var DIFF={easy:{speed:.82,time:1.22,goal:.86,lives:4,label:'easy'},normal:{speed:1,time:1,goal:1,lives:3,label:'normal'},hard:{speed:1.22,time:.9,goal:1.14,lives:3,label:'hard'}};
  var avatarFrames={boy:[],girl:[]};
  ['boy','girl'].forEach(function(g){for(var i=0;i<8;i++){var im=new Image();im.src='assets/avatar-'+g+'-frame-'+i+'.webp';avatarFrames[g].push(im)}});

  Object.assign(T.es,{difficulty:'ELIGE LA DIFICULTAD',easy:'EXPLORADOR',easySub:'Más tiempo · 4 vidas',normal:'GUARDIÁN',normalSub:'Desafío equilibrado',hard:'LEYENDA',hardSub:'Más rápido · más objetivos',resume:'CONTINUAR PARTIDA GUARDADA',downloadCert:'DESCARGAR CERTIFICADO',finalChallenge:'PRUEBA FINAL',proveGuardian:'Demuestra que eres Guardián',quizIntro:'Responde correctamente al menos dos preguntas para recuperar el cristal y recibir tu certificado.',scanHint:'Activa el escáner para revelar las amenazas.',scanReady:'¡ESCÁNER ACTIVO!',bonusDone:'¡MISIÓN ESPECIAL COMPLETADA! +350',bonus1:'Especial: atrapa 8 residuos seguidos',bonus2:'Especial: identifica 4 amenazas distintas',bonus3:'Especial: destruye 3 obstáculos con el escudo'});
  Object.assign(T.en,{difficulty:'CHOOSE DIFFICULTY',easy:'EXPLORER',easySub:'More time · 4 lives',normal:'GUARDIAN',normalSub:'Balanced challenge',hard:'LEGEND',hardSub:'Faster · more targets',resume:'CONTINUE SAVED GAME',downloadCert:'DOWNLOAD CERTIFICATE',finalChallenge:'FINAL TRIAL',proveGuardian:'Prove you are a Guardian',quizIntro:'Answer at least two questions correctly to restore the crystal and receive your certificate.',scanHint:'Activate the scanner to reveal the threats.',scanReady:'SCANNER ACTIVE!',bonusDone:'SPECIAL MISSION COMPLETE! +350',bonus1:'Special: catch 8 pieces of waste in a row',bonus2:'Special: identify 4 different threats',bonus3:'Special: destroy 3 obstacles with the shield'});
  T.es.obj2b='Pulsa 💎 o ESPACIO para escanear. Identifica mercurio, minería, tóxicos y peces contaminados.';
  T.en.obj2b='Press 💎 or SPACE to scan. Identify mercury, mining, toxins, and contaminated fish.';

  var QUIZ={
    es:[
      {q:'¿Qué debes hacer si observas un vertimiento o minería insegura cerca del río?',a:['Entrar al agua para investigarlo','Avisar a un adulto o autoridad ambiental','Ignorarlo porque no es tu problema'],ok:1,why:'Correcto: se debe informar sin ponerse en peligro.'},
      {q:'¿Por qué el mercurio puede afectar a las personas?',a:['Puede acumularse en los peces que se consumen','Hace que el agua sea más fría','Solo afecta a las piedras'],ok:0,why:'Correcto: el mercurio puede pasar del agua a los peces y luego a las personas.'},
      {q:'¿Cuál acción ayuda de verdad a los ríos Cauca y Nechí?',a:['Dejar residuos pequeños en la orilla','Reducir plásticos, separar residuos y cuidar las fuentes de agua','Atrapar cualquier pez que aparezca'],ok:1,why:'Correcto: las acciones constantes y colectivas protegen el río.'}
    ],
    en:[
      {q:'What should you do if you see unsafe dumping or mining near the river?',a:['Enter the water to investigate','Tell an adult or environmental authority','Ignore it because it is not your problem'],ok:1,why:'Correct: report it without putting yourself in danger.'},
      {q:'Why can mercury affect people?',a:['It can build up in fish that people eat','It makes the water colder','It only affects rocks'],ok:0,why:'Correct: mercury can move from water to fish and then to people.'},
      {q:'Which action truly helps the Cauca and Nechí rivers?',a:['Leave small trash on the bank','Reduce plastic, sort waste, and protect water sources','Catch every fish you see'],ok:1,why:'Correct: consistent, collective action protects the river.'}
    ]
  };

  function saveGame(){
    if(!S.name)return;
    try{localStorage.setItem(SAVE_KEY,JSON.stringify({name:S.name,gender:S.gender,color:S.color,total:S.total,open:S.open,done:S.done,badges:S.badges,difficulty:S.difficulty||'normal',lang:lang,quizPassed:!!S.quizPassed}))}catch(e){}
    refreshResume();
  }
  function loadSave(){try{var d=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');return d&&d.name?d:null}catch(e){return null}}
  function refreshResume(){var d=loadSave(),b=$('resumeBtn');if(!b)return;b.hidden=!d;if(d)b.textContent=tr('resume')+' · '+d.name}
  function setDifficulty(name){S.difficulty=DIFF[name]?name:'normal';document.querySelectorAll('.difficulty').forEach(function(b){b.classList.toggle('active',b.dataset.difficulty===S.difficulty)})}

  var oldApplyLang=applyLang;
  applyLang=function(){oldApplyLang();refreshResume();if($('finalMission').classList.contains('active'))renderQuiz()};
  avatarURL=function(){return 'assets/avatar-'+(S.gender==='girl'?'girl':'boy')+'-frame-0.webp'};
  var oldAvatarUI=avatarUI;
  avatarUI=function(){oldAvatarUI();var g=S.gender==='girl'?'girl':'boy',src='assets/avatar-'+g+'-frame-0.webp',f='hue-rotate('+(S.color||0)+'deg)';['avatarPreview','avatarHudImg','dialogueAvatar'].forEach(function(id){var e=$(id);if(e){e.src=src;e.style.filter=f}});if($('finalAvatar')){$('finalAvatar').src='assets/avatar-'+g+'-frame-6.webp';$('finalAvatar').style.filter=f}};
  var oldWorld=world;
  world=function(){oldWorld();saveGame()};

  start=function(){
    var name=$('nameInput').value.trim();
    if(!name){$('nameError').classList.add('show');$('nameInput').focus();tone(150,.2);return}
    S={name:name,gender:S.gender,color:S.color,total:0,open:1,done:[],badges:[],difficulty:S.difficulty||'normal',quizPassed:false};
    $('nameError').classList.remove('show');$('avatarHud').classList.add('show');avatarUI();saveGame();world();show('world');startMusic();tone(800,.2);talkEvent('intro');
  };
  function resume(){var d=loadSave();if(!d)return;S=Object.assign({total:0,open:1,done:[],badges:[],difficulty:'normal'},d);lang=d.lang||lang;setDifficulty(S.difficulty);$('nameInput').value=S.name;$('avatarHud').classList.add('show');applyLang();avatarUI();world();show('world');startMusic();toast(lang==='es'?'Partida recuperada':'Game restored')}

  var oldLaunch=launch;
  launch=function(){
    oldLaunch();
    var d=DIFF[S.difficulty]||DIFF.normal,q=L[level];
    G.goal=Math.max(6,Math.round(q.goal*d.goal));G.time=Math.round(q.time*d.time);G.lives=d.lives;G.diff=d;G.pose=0;G.poseUntil=0;G.scan=0;G.scanCooldown=0;G.variants={};G.bonus={value:0,target:level===1?8:level===2?4:3,done:false};
    $('objectiveTitle').textContent=level===1?(lang==='es'?'ATRAPA ':'CATCH ')+G.goal+(lang==='es'?' RESIDUOS':' PIECES OF WASTE'):level===2?(lang==='es'?'DETECTA ':'DETECT ')+G.goal+(lang==='es'?' AMENAZAS':' THREATS'):(lang==='es'?'REÚNE ':'COLLECT ')+G.goal+(lang==='es'?' CRISTALES':' CRYSTALS');
    $('bonusTitle').textContent=tr('bonus'+level);$('powerBtn').textContent=level===2?'◉':'💎';$('powerBtn').classList.toggle('ready',level===2);updateBonus();hud();startMusic();
  };
  function updateBonus(){if(!G||!G.bonus)return;$('bonusProgress').textContent=G.bonus.done?'✓':Math.min(G.bonus.value,G.bonus.target)+' / '+G.bonus.target}
  function bonusStep(value){if(!G||!G.bonus||G.bonus.done)return;G.bonus.value=value==null?G.bonus.value+1:value;updateBonus();if(G.bonus.value>=G.bonus.target){G.bonus.done=true;G.score+=350;updateBonus();msg(tr('bonusDone'));tone(1120,.28);setTimeout(function(){tone(1390,.24)},180)}}

  update=function(dt){
    if(!G||!G.run)return;
    var speed=(G.diff&&G.diff.speed)||1,gd=dt*speed;
    G.elapsed+=gd;G.time-=dt;G.spawn-=gd;if(G.poseUntil&&performance.now()>G.poseUntil)G.pose=0;
    if(level===2){G.scan=Math.max(0,G.scan-dt);G.scanCooldown=Math.max(0,G.scanCooldown-dt);$('powerBtn').classList.toggle('cooldown',G.scanCooldown>0);$('powerBtn').classList.toggle('ready',G.scanCooldown<=0)}
    if(level===1)up1(gd);if(level===2)up2(gd);if(level===3)up3(gd);
    G.parts.forEach(function(p){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=20*dt;p.life-=dt});G.parts=G.parts.filter(function(p){return p.life>0});G.shake*=.86;
    if(G.found>=G.goal)return end(1);if(G.time<=0||G.lives<=0)return end(G.found>=Math.ceil(G.goal*.72));hud();
  };

  var oldSpawn=spawn;
  spawn=function(type){oldSpawn(type);var o=G.objs[G.objs.length-1];if(level===1){o.variant=Math.floor(Math.random()*6);o.vy*=.86+Math.random()*.42;o.vx=(Math.random()-.5)*95}}
  up2=function(dt){
    if(G.spawn<=0){var danger=Math.random()<.72,dv=['mercury','barrel','mine','fishbad','pipe','dredge'],sv=['leaf','duck','water','turtle'];G.objs.push({type:danger?'danger':'safe',variant:(danger?dv:sv)[Math.floor(Math.random()*(danger?dv:sv).length)],x:70+Math.random()*(C.w-140),y:150+Math.random()*Math.max(90,C.h-220),r:33,vx:(Math.random()-.5)*115,vy:(Math.random()-.5)*75,life:4+Math.random()*1.8,phase:Math.random()*6,spin:0});G.spawn=Math.max(.48,.86-G.elapsed*.003)}
    G.objs.forEach(function(o){o.x+=o.vx*dt;o.y+=o.vy*dt;o.life-=dt;o.r=31+Math.sin(G.elapsed*5+o.phase)*3;if(o.x<45||o.x>C.w-45)o.vx*=-1;if(o.y<145||o.y>C.h-45)o.vy*=-1;if(o.life<=0)o.dead=1});G.objs=G.objs.filter(function(o){return !o.dead});
  };
  up3=function(dt){
    move(dt);var p=G.p;p.y=C.h*.8;if(G.spawn<=0){var r=Math.random(),type=r<.5?'crystal':r<.68?'rock':r<.82?'toxic':r<.92?'whirlpool':'log';oldSpawn(type);var o=G.objs[G.objs.length-1];o.vy=165+G.elapsed*3+Math.random()*115;o.vx=(Math.random()-.5)*50;G.spawn=Math.max(.2,.5-G.elapsed*.004)}
    G.objs.forEach(function(o){o.y+=o.vy*dt;o.x+=Math.sin(G.elapsed*3+o.phase)*29*dt;o.spin+=dt*2;if(Math.abs(o.x-p.x)<p.w*.42+o.r*.72&&Math.abs(o.y-p.y)<p.h*.42+o.r*.72){o.dead=1;G.attempts++;if(o.type==='crystal'){p.power=Math.min(100,p.power+15);good(o.x,o.y,12)}else if(p.shield<=0)bad(o.x,o.y);else{bonusStep();burst(o.x,o.y,'#54efff');tone(840,.1)}}else if(o.y>C.h+45)o.dead=1});G.objs=G.objs.filter(function(o){return !o.dead});
  };

  var richObj=obj;
  obj=function(o){
    if(level===2&&G.scan<=0){X.save();X.translate(o.x,o.y);X.globalAlpha=.24+.08*Math.sin(G.elapsed*5+o.phase);X.strokeStyle='#65e8f4';X.lineWidth=3;X.beginPath();X.arc(0,0,o.r*.72,0,Math.PI*2);X.stroke();X.beginPath();X.arc(0,0,o.r*1.05,0,Math.PI*2);X.stroke();X.restore();return}
    if(o.type==='whirlpool'){X.save();X.translate(o.x,o.y);X.rotate(G.elapsed*3);for(var i=0;i<4;i++){X.strokeStyle='rgba(79,230,255,'+(.8-i*.15)+')';X.lineWidth=5-i;X.beginPath();X.arc(0,0,9+i*7,i*.8,Math.PI*1.6+i*.8);X.stroke()}X.restore();return}
    if(o.type==='log'){X.save();X.translate(o.x,o.y);X.rotate(Math.sin(G.elapsed+o.phase)*.25);X.shadowBlur=12;X.shadowColor='#111';var lg=X.createLinearGradient(-33,0,33,0);lg.addColorStop(0,'#48240f');lg.addColorStop(.5,'#a7652f');lg.addColorStop(1,'#3b1d0d');X.fillStyle=lg;X.strokeStyle='#d29052';X.lineWidth=2;X.beginPath();X.roundRect(-36,-13,72,26,12);X.fill();X.stroke();X.restore();return}
    if(level===2&&(o.variant==='pipe'||o.variant==='dredge'||o.variant==='turtle')){drawExtraThreat(o);return}
    richObj(o);
  };
  function drawExtraThreat(o){X.save();X.translate(o.x,o.y);X.shadowBlur=19;X.lineWidth=3;if(o.variant==='pipe'){X.shadowColor='#ff724d';X.strokeStyle='#ffad7c';X.fillStyle='#704034';X.fillRect(-30,-18,46,26);X.fillRect(7,-18,20,45);X.fillStyle='#8cf05a';for(var i=0;i<3;i++){X.beginPath();X.arc(18,19+i*8,5-i,0,7);X.fill()}}else if(o.variant==='dredge'){X.shadowColor='#ffc44f';X.fillStyle='#c07a25';X.strokeStyle='#ffe29a';X.beginPath();X.moveTo(-34,17);X.lineTo(32,17);X.lineTo(22,31);X.lineTo(-26,31);X.closePath();X.fill();X.stroke();X.strokeStyle='#d89534';X.lineWidth=7;X.beginPath();X.moveTo(0,16);X.lineTo(14,-22);X.lineTo(34,-6);X.stroke()}else{X.shadowColor='#55edaa';X.fillStyle='#3aa86a';X.strokeStyle='#baffd8';X.beginPath();X.ellipse(0,4,27,20,0,0,7);X.fill();X.stroke();X.fillStyle='#69cc89';X.beginPath();X.arc(28,2,10,0,7);X.fill();X.stroke()}X.restore()}

  player=function(){
    var p=G.p,moving=Math.abs(p.vx)>32,frame=G.pose||0;if(!frame&&moving)frame=p.vx<0?1:2;if(p.shield>0)frame=5;var a=avatarFrames[S.gender]&&avatarFrames[S.gender][frame],bob=moving?Math.sin(G.elapsed*12)*4:Math.sin(G.elapsed*3)*2;
    X.save();X.translate(p.x,p.y+63);X.fillStyle='#00111988';X.beginPath();X.ellipse(0,0,44,11,0,0,7);X.fill();X.restore();X.save();X.translate(p.x,p.y+bob);X.shadowBlur=22;X.shadowColor='#48e8ff';X.filter='hue-rotate('+(S.color||0)+'deg) drop-shadow(0 9px 9px #00131d)';if(a&&a.complete)X.drawImage(a,-55,-84,110,148);else{var fallback=AV[S.gender];if(fallback.complete)X.drawImage(fallback,-48,-78,96,144)}X.filter='none';if(level===1){X.strokeStyle='#e3af66';X.lineWidth=4;X.beginPath();X.ellipse(31,35,25,17,-.2,0,7);X.stroke()}if(p.shield>0){X.strokeStyle='#a8fbff';X.shadowBlur=25;X.shadowColor='#42eaff';X.lineWidth=4;X.beginPath();X.arc(0,-5,70+Math.sin(G.elapsed*7)*4,0,7);X.stroke()}X.restore();
  };

  var oldGood=good,oldBad=bad;
  good=function(x,y,b){oldGood(x,y,b);G.pose=3;G.poseUntil=performance.now()+330;if(level===1)bonusStep(G.bonus.value+1)};
  bad=function(x,y){var before=G.lives;oldBad(x,y);if(G.lives<before){G.pose=4;G.poseUntil=performance.now()+520;if(level===1){G.bonus.value=0;updateBonus()}if(level===2)msg(lang==='es'?'⚠️ Ese elemento está sano. Usa el escáner y observa antes de tocar.':'⚠️ That is a healthy element. Scan and observe before tapping.');if(level===3)msg(lang==='es'?'⚠️ Esquiva la amenaza o activa el escudo.':'⚠️ Dodge the threat or activate your shield.')}};
  tap=function(x,y){if(level!==2||!G||!G.run)return;if(G.scan<=0){msg(tr('scanHint'));tone(240,.08);return}var o=G.objs.slice().reverse().find(function(a){return Math.hypot(a.x-x,a.y-y)<a.r*1.65});if(o){o.dead=1;G.attempts++;if(o.type==='danger'){G.variants[o.variant]=1;bonusStep(Object.keys(G.variants).length);good(o.x,o.y,16)}else bad(o.x,o.y)}};
  power=function(){if(!G||!G.run)return;if(level===2){if(G.scanCooldown>0)return;G.scan=2.6;G.scanCooldown=4.4;$('scanPulse').classList.remove('active');void $('scanPulse').offsetWidth;$('scanPulse').classList.add('active');msg(tr('scanReady'));tone(780,.24);return}if(level===3&&G.p.power>=60){G.p.power=0;G.p.shield=5;G.pose=5;G.poseUntil=performance.now()+5000;msg(tr('shield'));tone(950,.3);burst(G.p.x,G.p.y,'#62efff')}};

  var oldEnd=end;
  end=function(win){oldEnd(win);saveGame()};
  leaveImpact=function(){world();if(level===3)startFinalMission();else show('world')};
  var quizIndex=0,quizScore=0,quizLocked=false;
  function startFinalMission(){quizIndex=0;quizScore=0;quizLocked=false;show('finalMission');renderQuiz();tone(720,.22)}
  function renderQuiz(){if(!$('finalMission').classList.contains('active'))return;var list=QUIZ[lang],q=list[quizIndex];$('quizBar').style.width=((quizIndex+1)/3*100)+'%';$('quizCount').textContent=(quizIndex+1)+' / 3';$('quizQuestion').textContent=q.q;$('quizFeedback').textContent='';$('quizOptions').innerHTML='';quizLocked=false;q.a.forEach(function(answer,i){var b=document.createElement('button');b.className='quizOption';b.textContent=String.fromCharCode(65+i)+'. '+answer;b.onclick=function(){answerQuiz(i,b,q)};$('quizOptions').appendChild(b)})}
  function answerQuiz(choice,button,q){if(quizLocked)return;quizLocked=true;var buttons=$('quizOptions').querySelectorAll('button');buttons.forEach(function(b,i){b.disabled=true;if(i===q.ok)b.classList.add('correct')});if(choice===q.ok){quizScore++;button.classList.add('correct');$('quizFeedback').textContent='✓ '+q.why;tone(900,.2)}else{button.classList.add('wrong');$('quizFeedback').textContent=(lang==='es'?'La respuesta correcta está marcada. ':'The correct answer is highlighted. ')+q.why;tone(180,.16)}setTimeout(function(){quizIndex++;if(quizIndex<3)renderQuiz();else finishQuiz()},1050)}
  function finishQuiz(){if(quizScore>=2){S.quizPassed=true;S.total+=quizScore*150;saveGame();finish()}else{$('quizQuestion').textContent=lang==='es'?'El río necesita dos respuestas correctas. ¡Inténtalo otra vez!':'The river needs two correct answers. Try again!';$('quizOptions').innerHTML='';var b=document.createElement('button');b.className='quizOption correct';b.textContent=lang==='es'?'REPETIR PRUEBA':'RETRY TRIAL';b.onclick=startFinalMission;$('quizOptions').appendChild(b);$('quizFeedback').textContent=(lang==='es'?'Resultado: ':'Score: ')+quizScore+' / 3'}}
  var oldFinish=finish;
  finish=function(){oldFinish();avatarUI();saveGame();setTimeout(function(){if(typeof talkEvent==='function')talkEvent('final')},550)};

  function compare(value){value=Math.max(0,Math.min(100,+value));$('afterLayer').style.width=(100-value)+'%';$('compareHandle').style.left=value+'%';var w=$('compareSlider').clientWidth;$('impactAfter').style.width=w+'px'}
  $('compareRange').addEventListener('input',function(){compare(this.value)});addEventListener('resize',function(){compare($('compareRange').value)});
  var oldRenderImpact=renderImpact;
  renderImpact=function(n){oldRenderImpact(n);$('compareRange').value=50;setTimeout(function(){compare(50)},20)};

  function downloadCertificate(){
    var c=document.createElement('canvas');c.width=1600;c.height=1100;var x=c.getContext('2d'),grad=x.createLinearGradient(0,0,1600,1100);grad.addColorStop(0,'#fffdf1');grad.addColorStop(.55,'#e8fbff');grad.addColorStop(1,'#fff1bf');x.fillStyle=grad;x.fillRect(0,0,c.width,c.height);x.strokeStyle='#c99928';x.lineWidth=18;x.strokeRect(32,32,1536,1036);x.strokeStyle='#0c7180';x.lineWidth=4;x.strokeRect(58,58,1484,984);x.textAlign='center';x.fillStyle='#0a5264';x.font='bold 42px Georgia';x.fillText(lang==='es'?'CERTIFICADO OFICIAL DE ARCANIS':'OFFICIAL ARCANIS CERTIFICATE',800,170);x.font='bold 78px Georgia';x.fillText(lang==='es'?'GUARDIÁN DE LOS RÍOS':'GUARDIAN OF THE RIVERS',800,275);x.fillStyle='#8b671b';x.font='34px Georgia';x.fillText(lang==='es'?'Se reconoce a':'This certificate recognizes',800,370);x.fillStyle='#9a4e16';x.font='italic bold 88px Georgia';x.fillText(S.name,800,500);x.strokeStyle='#bf9124';x.lineWidth=3;x.beginPath();x.moveTo(280,535);x.lineTo(1320,535);x.stroke();x.fillStyle='#294750';x.font='32px Georgia';wrapText(x,lang==='es'?'por superar los tres desafíos, la prueba final y demostrar su compromiso con la protección de los ríos Cauca y Nechí.':'for completing the three challenges and the final trial, and showing a commitment to protecting the Cauca and Nechí rivers.',800,620,1120,48);x.fillStyle='#0a6677';x.font='bold 42px Arial';x.fillText($('finalRank').textContent,800,790);x.fillStyle='#bc861a';x.font='bold 38px Arial';x.fillText(S.total+' PTS  ·  ★ '+(S.badges||[]).length,800,855);x.fillStyle='#566e73';x.font='26px Arial';x.fillText($('certificateDate').textContent,800,955);x.font='bold 29px Arial';x.fillText('💎  ARCANIS · CRYSTAL OF RIVERS',800,1015);var url=c.toDataURL('image/png');var a=document.createElement('a');a.href=url;a.download='Certificado-Arcanis-'+S.name.replace(/[^a-z0-9_-]/gi,'-')+'.png';document.body.appendChild(a);a.click();a.remove();toast(lang==='es'?'Certificado descargado':'Certificate downloaded')
  }
  function wrapText(ctx,text,x,y,maxWidth,lineHeight){var words=text.split(' '),line='';for(var n=0;n<words.length;n++){var test=line+words[n]+' ';if(ctx.measureText(test).width>maxWidth&&n>0){ctx.fillText(line,x,y);line=words[n]+' ';y+=lineHeight}else line=test}ctx.fillText(line,x,y)}

  var musicTimer=0,musicStep=0;
  function musicNote(){if(!sound||!audioCtx||document.hidden)return;try{var notes=[196,247,294,247,220,262,330,262],o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.value=notes[musicStep++%notes.length];o.connect(g);g.connect(audioCtx.destination);g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.linearRampToValueAtTime(.012,audioCtx.currentTime+.05);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.75);o.start();o.stop(audioCtx.currentTime+.8)}catch(e){}}
  function startMusic(){unlockAudio();if(!musicTimer)musicTimer=setInterval(musicNote,820)}

  document.querySelectorAll('.difficulty').forEach(function(b){b.onclick=function(){setDifficulty(b.dataset.difficulty);tone(650,.08)}});
  $('beginBtn').onclick=start;$('resumeBtn').onclick=resume;$('launchBtn').onclick=launch;$('impactContinue').onclick=leaveImpact;$('powerBtn').onclick=power;$('downloadCertificate').onclick=downloadCertificate;
  var oldSplash=$('splashBtn').onclick;$('splashBtn').onclick=function(){oldSplash();startMusic()};
  $('soundBtn').onclick=function(){sound=!sound;this.textContent=sound?'🔊':'🔇';if(sound){startMusic();tone(700,.08)}};
  document.addEventListener('visibilitychange',function(){if(!document.hidden&&sound)startMusic()});
  S.difficulty=S.difficulty||'normal';setDifficulty(S.difficulty);refreshResume();applyLang();avatarUI();
})();
