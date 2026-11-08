/* Arcanis V8 — unified realistic 2D world art */
(function(){
  'use strict';
  var art={
    1:'assets/world-1-cauca-2d-v8.webp',
    2:'assets/world-2-mercury-2d-v8.webp',
    3:'assets/world-3-nechi-2d-v8.webp'
  };
  [1,2,3].forEach(function(n){IMG[n].src=art[n];L[n].bg=art[n]});
  document.querySelectorAll('.portal').forEach(function(portal){var n=+portal.dataset.level,img=portal.querySelector('img');if(img&&art[n])img.src=art[n]});
})();
