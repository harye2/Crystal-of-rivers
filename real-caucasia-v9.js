/* Arcanis V9 — real Caucasia references transformed into 2D game worlds */
(function(){
  'use strict';
  var art={
    1:'assets/caucasia-level-1-real-2d-v9.webp',
    2:'assets/caucasia-level-2-dredge-2d-v9.webp',
    3:'assets/caucasia-level-3-bridge-2d-v9.webp'
  };

  [1,2,3].forEach(function(n){
    if(window.IMG&&IMG[n]) IMG[n].src=art[n];
    if(window.L&&L[n]) L[n].bg=art[n];
  });

  document.querySelectorAll('.portal').forEach(function(portal){
    var n=+portal.dataset.level;
    var img=portal.querySelector('img');
    if(img&&art[n]) img.src=art[n];
  });
})();
