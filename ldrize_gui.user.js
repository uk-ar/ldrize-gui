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
var $N = window.Minibuffer.$N;
var D = window.Minibuffer.D();

var run = function(){
  //var siteinfo = window.LDRize.getSiteinfo();
  //var p=$X(siteinfo.paragraph);

  //var indicator=document.getElementById("gm_ldrize_indicator");
  //var indicator=$X("id('gm_ldrize_indicator')")[0];
  var indicator=$X('//*[@id="gm_ldrize_indicator"]')[0];
  var attr = {
    id : "id",
    style: "float:left"
  }
 
  var siteinfo = window.LDRize.getSiteinfo();
  var paragraphs=$X(siteinfo['paragraph']);
  
  var add_button_to_paragraph = function(evt){
    //console.log("added");
    //need recalculate
    var added_paragraphs;
    if($X(siteinfo['paragraph']).length == paragraphs.length){
      added_paragraphs = paragraphs;
    }else{
      added_paragraphs = $X(siteinfo['paragraph']).slice(paragraphs.length);
    }
    //console.log("added_paragraphs"+added_paragraphs);
    paragraphs = $X(siteinfo['paragraph']);

    //idがかぶってる場合うまくとれない
    //paragraphs = $X(siteinfo['paragraph'], evt.target);

    added_paragraphs.forEach(function(paragraph){
      //because not work for autopager autopagerize 比較
      //paragraph=paragraph.firstChild;
      var e = $X(siteinfo['link'], paragraph)[0].parentNode;
      var pin_button = $N('button',{id: "id",style: "background: red"},"hoge");
      pin_button.addEventListener('click', function(){
	//if current node = 0;
	window.Minibuffer.execute('current-node|toggle-pin');
	window.Minibuffer.execute('LDRize::next');
	update();
      },false);

      e.insertBefore(pin_button,e.firstChild);
    });
  }
  //window.addEventListener('AutoPagerize_DOMNodeInserted', add_button_to_paragraph, false);
  //add_button_to_paragraph();

  var update = function(){
    //becase when display  ==  'none' then e.offsetWidth == 0
    var offset = e.offsetWidth;
    e.style.display='none';
    e.style.top=indicator.y+indicator.height+'px';
    e.style.left=indicator.x+indicator.width-offset+'px';//if <0
    e.style.display='inline';
  }

  var skip_top = function(){
    var current_node;
    try{
      //if error (browse-url "http://furyu.tea-nifty.com/annex/2008/11/readmoreldrize-.html")
      current_node = window.Minibuffer.execute('current-node');//need if undefined
    } catch (e){}
    if(current_node === undefined){
      window.Minibuffer.execute('LDRize::next');
    }
  }

  var command = function(stdin, comment){
    skip_top();
    window.Minibuffer.execute('LDRize::next');
    update();
  }
  window.Minibuffer.addShortcutkey({
    key: 'j',
    description: 'Nearly::next', // 説明
    command: command
  });
  var next_button = $N('button',attr,"↓");
  next_button.addEventListener('click', command ,false);

  var command = function(stdin, comment){
    window.Minibuffer.execute('LDRize::prev');
    update();
  }
  window.Minibuffer.addShortcutkey({
    key: 'k',
    description: 'Nearly::prev', // 説明
    command: command
  });
  var prev_button = $N('button',attr,"↑");
  prev_button.addEventListener('click', command ,false);

  var command = function(stdin, comment){
    skip_top();
    window.Minibuffer.execute('current-node|toggle-pin');
    window.Minibuffer.execute('LDRize::next');
    update();
  }
  window.Minibuffer.addShortcutkey({
    key: 'p',
    description: 'Nearly::pin', // 説明
    command: command
  });
  var pin_button = $N('button',attr,"P");
  pin_button.addEventListener('click', command, false);
  
  var select_button =
    $N('select',attr ,
       [$N('option', {value: "", selected: "selected",}, "pinned.."),
	$N('option', {value: "include"}, "include"),
	$N('option', {value: "exclude"}, "exclude"),
       ]);
  select_button.addEventListener('change', function(){
    //console.log(this.options[this.selectedIndex].value);
    switch(this.options[this.selectedIndex].value){
    case "include":
      window.Minibuffer.execute('Nearly::include');
      break;
    case "exclude":
      window.Minibuffer.execute('Nearly::exclude');
      break;
    }
    update();
    this.selectedIndex = 0;
  },false);

  var e = $N('div', {id: "hoge", style:"position:absolute"},
  	     [pin_button, next_button, prev_button, select_button])

  // e.addEventListener('click', function(){
  //   window.Minibuffer.execute('LDRize::next');
  //   update();
  // },false);
  
  $X('//*[@id="gm_ldrize"]')[0].appendChild(e);

  update();


}

// Based on AutoPagerize.addFilter workaround

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
 