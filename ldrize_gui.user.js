// ==UserScript==
// @name           ldrize gui
// @namespace      http://fuga
// @include        https://*
// @include        http://*
// ==/UserScript==

try { if(top !== self) throw 0 }catch([]){ return }// iframe内ならreturn

if(!window.Minibuffer) return;
if(!window.LDRize)return;
var $X = window.Minibuffer.$X;
var D = window.Minibuffer.D();

var run = function(){
  //var siteinfo = window.LDRize.getSiteinfo();
  //var p=$X(siteinfo.paragraph);

  //var indicator=document.getElementById("gm_ldrize_indicator");
  //var indicator=$X('//*[@id="gm_ldrize_indicator"]')[0];
  //var indicator=$X("id('gm_ldrize_indicator')")[0];
  var indicator=$X('//*[@id="gm_ldrize_indicator"]')[0];
  var attr = {
    id : "id",
    style: "position:absolute;top:148px;left:161px"
  }
  var e = $N('button',attr,"fuga");
  e.addEventListener('click', function(){
    window.Minibuffer.execute('LDRize::next');
    console.log("but!");
    update();
  },false);
  //console.log("ld:"+ $X('//*[@id="gm_ldrize"]'));//[0].appendChild(e);
  $X('//*[@id="gm_ldrize"]')[0].appendChild(e);

  var update = function(){
    e.style.display='none';
    e.style.top=indicator.y+11+'px';
    e.style.left=indicator.x+'px';
    e.style.display='inline';
  }

  update();

  window.Minibuffer.addShortcutkey({
    key: 'm',
    description: 'Show::location::by::key', // 説明
    command: function(){ // 実行するコマンド
      window.Minibuffer.execute('LDRize::next');
      console.log("m!");
      update();
      // e.style.display='none';
      // e.style.top=indicator.y+11+'px';
      // e.style.left=indicator.x+'px';
      // e.style.display='inline';
    }
  });
  window.Minibuffer.addShortcutkey({
    key: ',',
    description: 'Show::location::by::key2', // 説明
    command: function(){ // 実行するコマンド
      window.Minibuffer.execute('LDRize::prev');
      console.log("m!");
      update();
      // e.style.display='none';
      // e.style.top=indicator.y+11+'px';
      // e.style.left=indicator.x+'px';
      // e.style.display='inline';
    }
  });

}

// Based on AutoPagerize.addFilter workaround
var $X=window.Minibuffer.$X;
var $N=window.Minibuffer.$N;

var i=4;
function waitMinibuffer() {
  if(window.Minibuffer
     && window.Minibuffer.addCommand
     && window.LDRize
     && window.LDRize.getSiteinfo
     && $X('//*[@id="gm_ldrize_indicator"]')
     && $X('//*[@id="gm_ldrize"]')
    ) {
    run();
  } else if(i-- > 0) {
    setTimeout(arguments.callee, 500);
  }
}
waitMinibuffer();
