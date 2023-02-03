/**
 * Salient Lottie script file.
 *
 * @package Salient
 * @author ThemeNectar
 *
 * global lottie
 */


 !function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self).LottieInteractivity={})}(this,(function(e){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){if(null==e)return{};var n,i,a=function(e,t){if(null==e)return{};var n,i,a={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}function o(e,t){var n=t.get(e);if(!n)throw new TypeError("attempted to get private field on non-instance");return n.get?n.get.call(e):n.value}var s={player:"lottie-player"},l="[lottieInteractivity]:",c=function(){function e(){var i=this,c=arguments.length>0&&void 0!==arguments[0]?arguments[0]:s,C=c.actions,A=c.container,T=c.mode,H=c.player,O=r(c,["actions","container","mode","player"]);if(n(this,e),p.set(this,{writable:!0,value:function(){if(i.player){var e=function(){i.player.addEventListener("enterFrame",o(i,E)),i.container.addEventListener("mouseenter",o(i,w)),i.container.addEventListener("mouseleave",o(i,I)),i.container.addEventListener("touchstart",o(i,w),{passive:!0}),i.container.addEventListener("touchend",o(i,I),{passive:!0})};i.stateHandler.set("loop",(function(){i.actions[i.interactionIdx].loop?i.player.loop=parseInt(i.actions[i.interactionIdx].loop)-1:i.player.loop=!0,i.player.autoplay=!0})),i.stateHandler.set("autoplay",(function(){i.player.loop=!1,i.player.autoplay=!0})),i.stateHandler.set("click",(function(){i.player.loop=!1,i.player.autoplay=!1,i.container.addEventListener("click",o(i,d))})),i.stateHandler.set("hover",(function(){i.player.loop=!1,i.player.autoplay=!1,i.container.addEventListener("mouseenter",o(i,d)),i.container.addEventListener("touchstart",o(i,d),{passive:!0})})),i.transitionHandler.set("click",(function(){i.container.addEventListener("click",o(i,u))})),i.transitionHandler.set("hover",(function(){i.container.addEventListener("mouseenter",o(i,u)),i.container.addEventListener("touchstart",o(i,u),{passive:!0})})),i.transitionHandler.set("hold",e),i.transitionHandler.set("pauseHold",e),i.transitionHandler.set("repeat",(function(){i.player.loop=!0,i.player.autoplay=!0;i.player.addEventListener("loopComplete",(function e(){o(i,L).call(i,{handler:e})}))})),i.transitionHandler.set("onComplete",(function(){"loop"===i.actions[i.interactionIdx].state?i.player.addEventListener("loopComplete",o(i,f)):i.player.addEventListener("complete",o(i,f))})),i.transitionHandler.set("seek",(function(){i.player.stop(),i.player.addEventListener("enterFrame",o(i,g)),i.container.addEventListener("mousemove",o(i,y)),i.container.addEventListener("touchmove",o(i,v),{passive:!1}),i.container.addEventListener("mouseout",o(i,m))}))}}}),d.set(this,{writable:!0,value:function(){var e=i.actions[i.interactionIdx].forceFlag;e||!0!==i.player.isPaused?e&&o(i,b).call(i,!0):o(i,b).call(i,!0)}}),h.set(this,{writable:!0,value:function(){0===i.clickCounter?(i.player.play(),i.clickCounter++):(i.clickCounter++,i.player.setDirection(-1*i.player.playDirection),i.player.play())}}),u.set(this,{writable:!0,value:function(){var e=i.actions[i.interactionIdx].forceFlag,t=i.actions[i.interactionIdx].state,n=i.actions[i.interactionIdx].transition;if("chain"===i.mode){if(i.actions[i.interactionIdx].count){var a=parseInt(i.actions[i.interactionIdx].count);if(i.clickCounter<a-1)return void(i.clickCounter+=1)}return i.clickCounter=0,"click"===n&&"click"===t||"hover"===n&&"hover"===t?i.transitionHandler.get("onComplete").call():i.nextInteraction(),i.container.removeEventListener("click",o(i,u)),void i.container.removeEventListener("mouseenter",o(i,u))}e||!0!==i.player.isPaused?e&&i.player.goToAndPlay(0,!0):i.player.goToAndPlay(0,!0)}}),y.set(this,{writable:!0,value:function(e){o(i,S).call(i,e.clientX,e.clientY)}}),v.set(this,{writable:!0,value:function(e){e.cancelable&&e.preventDefault(),o(i,S).call(i,e.touches[0].clientX,e.touches[0].clientY)}}),m.set(this,{writable:!0,value:function(){o(i,S).call(i,-1,-1)}}),f.set(this,{writable:!0,value:function(){"loop"===i.actions[i.interactionIdx].state?i.player.removeEventListener("loopComplete",o(i,f)):i.player.removeEventListener("complete",o(i,f)),i.nextInteraction()}}),L.set(this,{writable:!0,value:function(e){var t=e.handler,n=1;i.actions[i.interactionIdx].repeat&&(n=i.actions[i.interactionIdx].repeat),i.playCounter>=n-1?(i.playCounter=0,i.player.removeEventListener("loopComplete",t),i.player.loop=!1,i.player.autoplay=!1,i.nextInteraction()):i.playCounter+=1}}),g.set(this,{writable:!0,value:function(){var e=i.actions[i.interactionIdx].frames;e&&i.player.currentFrame>=parseInt(e[1])-1&&(i.player.removeEventListener("enterFrame",o(i,g)),i.container.removeEventListener("mousemove",o(i,y)),i.container.removeEventListener("mouseout",o(i,m)),setTimeout(i.nextInteraction,0))}}),E.set(this,{writable:!0,value:function(){var e=i.actions[i.interactionIdx].frames;(e&&i.player.currentFrame>=e[1]||i.player.currentFrame>=i.player.totalFrames-1)&&(i.player.removeEventListener("enterFrame",o(i,E)),i.container.removeEventListener("mouseenter",o(i,w)),i.container.removeEventListener("mouseleave",o(i,I)),i.container.removeEventListener("touchstart",o(i,w),{passive:!0}),i.container.removeEventListener("touchend",o(i,I),{passive:!0}),i.player.pause(),i.holdStatus=!1,i.nextInteraction())}}),w.set(this,{writable:!0,value:function(){-1!==i.player.playDirection&&null!==i.holdStatus&&i.holdStatus||(i.player.setDirection(1),i.player.play(),i.holdStatus=!0)}}),I.set(this,{writable:!0,value:function(){"hold"===i.actions[i.interactionIdx].transition||"hold"===i.actions[0].type?(i.player.setDirection(-1),i.player.play()):"pauseHold"!==i.actions[i.interactionIdx].transition&&"pauseHold"!==i.actions[0].type||i.player.pause(),i.holdStatus=!1}}),x.set(this,{writable:!0,value:function(){var e=i.actions[i.interactionIdx].state,t=i.actions[i.interactionIdx].transition;"hover"!==e&&"click"!==e||(i.container.removeEventListener("click",o(i,d)),i.container.removeEventListener("mouseenter",o(i,d))),"hover"!==t&&"click"!==t||(i.container.removeEventListener("click",o(i,u)),i.container.removeEventListener("mouseenter",o(i,u)),i.container.removeEventListener("touchstart",o(i,u),{passive:!0}))}}),a(this,"jumpToInteraction",(function(e){o(i,x).call(i),i.interactionIdx=e,i.interactionIdx<0?i.interactionIdx=0:i.interactionIdx,i.nextInteraction(!1)})),a(this,"nextInteraction",(function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];i.oldInterctionIdx=i.interactionIdx,o(i,x).call(i);var t=i.actions[i.interactionIdx].jumpTo;t?t>=0&&t<i.actions.length?(i.interactionIdx=t,o(i,P).call(i,{ignorePath:!1})):(i.interactionIdx=0,i.player.goToAndStop(0,!0),o(i,P).call(i,{ignorePath:!1})):(e&&i.interactionIdx++,i.interactionIdx>=i.actions.length?i.actions[i.actions.length-1].reset?(i.interactionIdx=0,i.player.resetSegments(!0),i.actions[i.interactionIdx].frames?i.player.goToAndStop(i.actions[i.interactionIdx].frames,!0):i.player.goToAndStop(0,!0),o(i,P).call(i,{ignorePath:!1})):(i.interactionIdx=i.actions.length-1,o(i,P).call(i,{ignorePath:!1})):o(i,P).call(i,{ignorePath:!1})),i.container.dispatchEvent(new CustomEvent("transition",{bubbles:!0,composed:!0,detail:{oldIndex:i.oldInterctionIdx,newIndex:i.interactionIdx}}))})),b.set(this,{writable:!0,value:function(e){var t=i.actions[i.interactionIdx].frames;if(!t)return i.player.resetSegments(!0),void i.player.goToAndPlay(0,!0);"string"==typeof t?i.player.goToAndPlay(t,e):i.player.playSegments(t,e)}}),k.set(this,{writable:!0,value:function(){var e=i.actions[i.interactionIdx].path;if(!e)if("object"===t(i.enteredPlayer)&&"AnimationItem"===i.enteredPlayer.constructor.name){if(e=i.enteredPlayer,i.player===e)return void o(i,P).call(i,{ignorePath:!0})}else{var n=(e=i.loadedAnimation).substr(e.lastIndexOf("/")+1);if(n=n.substr(0,n.lastIndexOf(".json")),i.player.fileName===n)return void o(i,P).call(i,{ignorePath:!0})}var a=i.container.getBoundingClientRect(),r="width: "+a.width+"px !important; height: "+a.height+"px !important; background: "+i.container.style.background;if(i.container.setAttribute("style",r),"object"!==t(i.enteredPlayer)||"AnimationItem"!==i.enteredPlayer.constructor.name){if("string"==typeof i.enteredPlayer){var s=document.querySelector(i.enteredPlayer);s&&"LOTTIE-PLAYER"===s.nodeName&&(i.attachedListeners||(s.addEventListener("ready",(function(){i.container.style.width="",i.container.style.height=""})),s.addEventListener("load",(function(){i.player=s.getLottie(),o(i,P).call(i,{ignorePath:!0})})),i.attachedListeners=!0),s.load(e))}else i.enteredPlayer instanceof HTMLElement&&"LOTTIE-PLAYER"===i.enteredPlayer.nodeName&&(i.attachedListeners||(i.enteredPlayer.addEventListener("ready",(function(){i.container.style.width="",i.container.style.height=""})),i.enteredPlayer.addEventListener("load",(function(){i.player=i.enteredPlayer.getLottie(),o(i,P).call(i,{ignorePath:!0})})),i.attachedListeners=!0),i.enteredPlayer.load(e));if(!i.player)throw new Error("".concat(l," Specified player is invalid."),i.enteredPlayer)}else{if(!window.lottie)throw new Error("".concat(l," A Lottie player is required."));i.stop(),i.player.destroy(),i.container.innerHTML="","object"===t(e)&&"AnimationItem"===e.constructor.name?i.player=window.lottie.loadAnimation({loop:!1,autoplay:!1,animationData:e.animationData,container:i.container}):i.player=window.lottie.loadAnimation({loop:!1,autoplay:!1,path:e,container:i.container}),i.player.addEventListener("DOMLoaded",(function(){i.container.style.width="",i.container.style.height="",o(i,P).call(i,{ignorePath:!0})}))}i.clickCounter=0,i.playCounter=0}}),P.set(this,{writable:!0,value:function(e){var t=e.ignorePath,n=i.actions[i.interactionIdx].state,a=i.actions[i.interactionIdx].transition,r=i.actions[i.interactionIdx].path,s=i.stateHandler.get(n),l=i.transitionHandler.get(a),c=i.actions[i.interactionIdx].speed?i.actions[i.interactionIdx].speed:1,p=i.actions[i.interactionIdx].delay?i.actions[i.interactionIdx].delay:0;t||!(r||i.actions[i.actions.length-1].reset&&0===i.interactionIdx)?setTimeout((function(){s?s.call():"none"===n&&(i.player.loop=!1,i.player.autoplay=!1),l&&l.call(),i.player.autoplay&&(i.player.resetSegments(!0),o(i,b).call(i,!0)),i.player.setSpeed(c)}),p):o(i,k).call(i)}}),S.set(this,{writable:!0,value:function(e,t){if(-1!==e&&-1!==t){var n=i.getContainerCursorPosition(e,t);e=n.x,t=n.y}var a=i.actions.find((function(n){var i=n.position;if(i){if(Array.isArray(i.x)&&Array.isArray(i.y))return e>=i.x[0]&&e<=i.x[1]&&t>=i.y[0]&&t<=i.y[1];if(!Number.isNaN(i.x)&&!Number.isNaN(i.y))return e===i.x&&t===i.y}return!1}));if(a)if("seek"===a.type||"seek"===a.transition){var r=(e-a.position.x[0])/(a.position.x[1]-a.position.x[0]),o=(t-a.position.y[0])/(a.position.y[1]-a.position.y[0]);i.player.playSegments(a.frames,!0),a.position.y[0]<0&&a.position.y[1]>1?i.player.goToAndStop(Math.floor(r*i.player.totalFrames),!0):i.player.goToAndStop(Math.ceil((r+o)/2*i.player.totalFrames),!0)}else"loop"===a.type?i.player.playSegments(a.frames,!0):"play"===a.type?(!0===i.player.isPaused&&i.player.resetSegments(),i.player.playSegments(a.frames)):"stop"===a.type&&(i.player.resetSegments(!0),i.player.goToAndStop(a.frames[0],!0))}}),M.set(this,{writable:!0,value:function(){var e=i.getContainerVisibility(),t=i.actions.find((function(t){var n=t.visibility;return e>=n[0]&&e<=n[1]}));if(t)if("seek"===t.type){var n=t.frames[0],a=2==t.frames.length?t.frames[1]:i.player.totalFrames-1;null!==i.assignedSegment&&(i.player.resetSegments(!0),i.assignedSegment=null),i.player.goToAndStop(n+Math.round((e-t.visibility[0])/(t.visibility[1]-t.visibility[0])*(a-n)),!0)}else"loop"===t.type?(i.player.loop=!0,(null===i.assignedSegment||i.assignedSegment!==t.frames||!0===i.player.isPaused)&&(i.player.playSegments(t.frames,!0),i.assignedSegment=t.frames)):"play"===t.type?i.scrolledAndPlayed||(i.scrolledAndPlayed=!0,i.player.resetSegments(!0),t.frames?i.player.playSegments(t.frames,!0):i.player.play()):"stop"===t.type&&i.player.goToAndStop(t.frames[0],!0)}}),this.enteredPlayer=H,"object"!==t(H)||"AnimationItem"!==H.constructor.name){if("string"==typeof H){var W=document.querySelector(H);W&&"LOTTIE-PLAYER"===W.nodeName&&(H=W.getLottie())}else H instanceof HTMLElement&&"LOTTIE-PLAYER"===H.nodeName&&(H=H.getLottie());if(!H){var j=l+"Specified player:"+H+" is invalid.";throw new Error(j)}}"string"==typeof A&&(A=document.querySelector(A)),A||(A=H.wrapper),this.player=H,this.loadedAnimation=this.player.path+this.player.fileName+".json",this.attachedListeners=!1,this.container=A,this.mode=T,this.actions=C,this.options=O,this.assignedSegment=null,this.scrolledAndPlayed=!1,this.interactionIdx=0,this.oldInterctionIdx=0,this.clickCounter=0,this.playCounter=0,this.stateHandler=new Map,this.transitionHandler=new Map}var c,C,A;return c=e,(C=[{key:"getContainerVisibility",value:function(){var e=this.container.getBoundingClientRect(),t=e.top,n=e.height;return(window.innerHeight-t)/(window.innerHeight+n)}},{key:"getContainerCursorPosition",value:function(e,t){var n=this.container.getBoundingClientRect(),i=n.top;return{x:(e-n.left)/n.width,y:(t-i)/n.height}}},{key:"initScrollMode",value:function(){this.player.stop(),window.addEventListener("scroll",o(this,M),!0)}},{key:"initCursorMode",value:function(){this.actions&&1===this.actions.length?"click"===this.actions[0].type?(this.player.loop=!1,this.player.stop(),this.container.addEventListener("click",o(this,u))):"hover"===this.actions[0].type?(this.player.loop=!1,this.player.stop(),this.container.addEventListener("mouseenter",o(this,u)),this.container.addEventListener("touchstart",o(this,u),{passive:!0})):"toggle"===this.actions[0].type?(this.player.loop=!1,this.player.stop(),this.container.addEventListener("click",o(this,h))):"hold"===this.actions[0].type||"pauseHold"===this.actions[0].type?(this.container.addEventListener("mouseenter",o(this,w)),this.container.addEventListener("mouseleave",o(this,I)),this.container.addEventListener("touchstart",o(this,w),{passive:!0}),this.container.addEventListener("touchend",o(this,I),{passive:!0})):"seek"===this.actions[0].type&&(this.player.loop=!0,this.player.stop(),this.container.addEventListener("mousemove",o(this,y)),this.container.addEventListener("touchmove",o(this,v),{passive:!1}),this.container.addEventListener("mouseout",o(this,m))):(this.player.loop=!0,this.player.stop(),this.container.addEventListener("mousemove",o(this,y)),this.container.addEventListener("mouseleave",o(this,m)),o(this,S).call(this,-1,-1))}},{key:"initChainMode",value:function(){o(this,p).call(this),this.player.loop=!1,this.player.stop(),o(this,P).call(this,{ignorePath:!1})}},{key:"start",value:function(){var e=this;"scroll"===this.mode?this.player.isLoaded?this.initScrollMode():this.player.addEventListener("DOMLoaded",(function(){e.initScrollMode()})):"cursor"===this.mode?this.player.isLoaded?this.initCursorMode():this.player.addEventListener("DOMLoaded",(function(){e.initCursorMode()})):"chain"===this.mode&&(this.player.isLoaded?this.initChainMode():this.player.addEventListener("DOMLoaded",(function(){e.initChainMode()})))}},{key:"redefineOptions",value:function(e){var n=e.actions,i=e.container,a=e.mode,o=e.player,s=r(e,["actions","container","mode","player"]);if(this.stop(),this.enteredPlayer=o,"object"!==t(o)||"AnimationItem"!==o.constructor.name){if("string"==typeof o){var c=document.querySelector(o);c&&"LOTTIE-PLAYER"===c.nodeName&&(o=c.getLottie())}else o instanceof HTMLElement&&"LOTTIE-PLAYER"===o.nodeName&&(o=o.getLottie());if(!o)throw new Error(l+"Specified player:"+o+" is invalid.",o)}"string"==typeof i&&(i=document.querySelector(i)),i||(i=o.wrapper),this.player=o,this.loadedAnimation=this.player.path+this.player.fileName+".json",this.attachedListeners=!1,this.container=i,this.mode=a,this.actions=n,this.options=s,this.assignedSegment=null,this.scrolledAndPlayed=!1,this.interactionIdx=0,this.clickCounter=0,this.playCounter=0,this.holdStatus=null,this.stateHandler=new Map,this.transitionHandler=new Map,this.start()}},{key:"stop",value:function(){if("scroll"===this.mode&&window.removeEventListener("scroll",o(this,M),!0),"cursor"===this.mode&&(this.container.removeEventListener("click",o(this,u)),this.container.removeEventListener("click",o(this,h)),this.container.removeEventListener("mouseenter",o(this,u)),this.container.removeEventListener("touchstart",o(this,u)),this.container.removeEventListener("touchmove",o(this,v)),this.container.removeEventListener("mousemove",o(this,y)),this.container.removeEventListener("mouseleave",o(this,m)),this.container.removeEventListener("touchstart",o(this,w)),this.container.removeEventListener("touchend",o(this,I))),"chain"===this.mode&&(this.container.removeEventListener("click",o(this,u)),this.container.removeEventListener("click",o(this,d)),this.container.removeEventListener("mouseenter",o(this,u)),this.container.removeEventListener("touchstart",o(this,u)),this.container.removeEventListener("touchmove",o(this,v)),this.container.removeEventListener("mouseenter",o(this,d)),this.container.removeEventListener("touchstart",o(this,d)),this.container.removeEventListener("mouseenter",o(this,w)),this.container.removeEventListener("touchstart",o(this,w)),this.container.removeEventListener("mouseleave",o(this,I)),this.container.removeEventListener("mousemove",o(this,y)),this.container.removeEventListener("mouseout",o(this,m)),this.container.removeEventListener("touchend",o(this,I)),this.player))try{this.player.removeEventListener("loopComplete",o(this,f)),this.player.removeEventListener("complete",o(this,f)),this.player.removeEventListener("enterFrame",o(this,g)),this.player.removeEventListener("enterFrame",o(this,E))}catch(e){}this.player=null}}])&&i(c.prototype,C),A&&i(c,A),e}(),p=new WeakMap,d=new WeakMap,h=new WeakMap,u=new WeakMap,y=new WeakMap,v=new WeakMap,m=new WeakMap,f=new WeakMap,L=new WeakMap,g=new WeakMap,E=new WeakMap,w=new WeakMap,I=new WeakMap,x=new WeakMap,b=new WeakMap,k=new WeakMap,P=new WeakMap,S=new WeakMap,M=new WeakMap,C=function(e){var t=new c(e);return t.start(),t};e.LottieInteractivity=c,e.create=C,e.default=C,Object.defineProperty(e,"__esModule",{value:!0})}));

(function ($) {
  "use strict";

  function NectarLottie(el) {
    this.el = el;

    this.setupProps();
    this.domPosition();

    if( $(this.el).parents('.tabbed').length == 0 && !this.isInstagram() ) {
      this.inViewLoad(); 
    } else {
      this.init();
    }
    
  }

  var proto = NectarLottie.prototype;

  proto.setupProps = function () {
    let attrs = JSON.parse(this.el.getAttribute("data-lottie-settings"));

    // Convert sttings to bools
    const arrayAttrs = Object.keys(attrs);
    arrayAttrs.forEach((key) => {
      attrs[key] = attrs[key] === "true" ? true : attrs[key];
    });

    // Set defaults
    Object.assign(
      this,
      {
        json_url: "",
        trigger_type: "viewport",
        hover_func: 'hover',
        loop: false,
        mobile_func: 'default',
        trigger_offset: '0, 100',
        trigger_delay: 0,
        frame_constraint: '0, 100',
        speed: 1,
        frameCount: 0,
        attach_to_element: '',
        preserve_aspect_ratio: 'xMidYMid meet'
      },
      attrs
    );

    if( window.nectarDOMInfo && window.nectarDOMInfo.winW > 1000) {
      this.mobile_func = 'default';
    }
  };

  proto.domPosition = function() {
    if( this.attach_to_element.length > 0 ) {
      const $element = $(this.el).parent().detach();
      $('body').find(this.attach_to_element).append($element);
    }
  };

  proto.init = function () {
  
    // Create lottie object
    this.id = "nectar-lottie-" + Math.ceil(Date.now() + Math.random());

    this.el.setAttribute("id", this.id);

    // Settings which disable loop.
    if( this.mobile_func === 'last_frame' ||
        this.trigger_type === "seek" || 
        this.trigger_type === "hover") {
      this.loop = false;
    } 

    this.instance = lottie.loadAnimation({
      container: this.el,
      renderer: "svg",
      loop: this.loop,
      autoplay: false,
      path: this.json_url,
      rendererSettings: {
        preserveAspectRatio: this.preserve_aspect_ratio
      }
    });

    // Set speed.
    this.instance.setSpeed(parseFloat(this.speed));

    // Alter scroll based play when visible mode when element starts in view
    if( this.trigger_type === "play" && this.inView(this.el) ) {
      this.trigger_type = 'autoplay';
    }
    if( this.mobile_func === 'last_frame' ) {
      this.trigger_delay = 0;
      this.trigger_type = 'autoplay';
    }

    // Autoplay type setting frame range.
    if( this.trigger_type === "autoplay" ) {
        this.instance.addEventListener("DOMLoaded", () => {
          if( this.trigger_delay != 0 ) {
            setTimeout(this.playFrames.bind(this), this.trigger_delay);
          } else {
            this.playFrames();
          }     
        }); 
    } 


    this.instance.addEventListener("data_ready", () => {

        // Store frame range as it can change after playing segments.
        this.frameCount = this.instance.totalFrames;

         // Scroll/Hover based.
        if( this.trigger_type !== "autoplay" && this.trigger_delay == 0) {
            this.lottieInteractivity();
        } else if( this.trigger_type == "play" && this.trigger_delay != 0) {
          this.scrollTriggerPlay();
        }
    });
  

  };
  
  /**
    * Play frames based on scroll/hover.
    *
    */
  proto.lottieInteractivity = function() {

    let that = this;

    let viewportPercentages = this.trigger_offset.split(',');
    viewportPercentages = viewportPercentages.map((item) => parseInt(item)/100);

    let framePercentages = this.frame_constraint.split(',');
    framePercentages = framePercentages.map((item) => Math.floor(this.instance.totalFrames * (parseInt(item)/100)));

    if( this.trigger_type === 'seek' ) {
        framePercentages[1] -= 1;
    }

    let mode = (this.trigger_type === 'hover') ? 'cursor' : 'scroll';
    let type = (this.trigger_type === 'hover') ? this.hover_func : this.trigger_type;

    this.interactiveInstance = LottieInteractivity.create({
        mode: mode,
        player: this.instance,
        actions: [
          {
            visibility: viewportPercentages, // arr like [0, 1.0]]
            type: type, // string
            frames: [framePercentages[0], framePercentages[1]], // arr like [0,100]]
          },
        ],
      });

      $(window).trigger('salient-parallax-el-recalculate');
      $(window).trigger('salient-parallax-bg-recalculate');
    
  };


  /**
    * Called when a delay is set and the type is autoplay/play.
    *
    */
  proto.scrollTriggerPlay = function() {

    const that = this;
    const observer = new IntersectionObserver(function(entries) {

      entries.forEach(function(entry){
        var isIntersecting = entry.isIntersecting;

        if (isIntersecting) {
          setTimeout(that.playFrames.bind(that), that.trigger_delay);
          $(window).trigger('salient-parallax-el-recalculate');
          $(window).trigger('salient-parallax-bg-recalculate');
          observer.unobserve(entry.target);
        } 
      });

    }, {
      root: (this.isSafari()) ? null : document,
      rootMargin: '-12% 0% -12% 0%',
      threshold: 0
    });

    observer.observe(this.el);
    
  };


  /**
    * Lazy initialize lottie.
    *
    */
  proto.lazyInit = function() {

    const that = this;
    const observer = new IntersectionObserver(function(entries) {

      entries.forEach(function(entry){
        var isIntersecting = entry.isIntersecting;

        if (isIntersecting) {
          that.init();
          observer.unobserve(entry.target);
          $(window).trigger('salient-parallax-el-recalculate');
          $(window).trigger('salient-parallax-bg-recalculate');
        } 
      });

    }, {
      root: (this.isSafari()) ? null : document,
      rootMargin: '300px 0px 300px 0px',
      threshold: 0
    });

    observer.observe(this.el);

  };



  /**
    * Determine if element is in view onload.
    *
    */
  proto.inView = function(el) {
    let rect = el.getBoundingClientRect();
    if( rect.top < window.innerHeight ) {
      return true;
      
    }
    return false;

  };


  proto.isSafari = function() {
    if (navigator.userAgent.indexOf('Safari') != -1 && 
      navigator.userAgent.indexOf('Chrome') == -1) {
        return true;
    } 

    return false;
  };
  
  proto.isInstagram = function() {
    if ( navigator.userAgent.indexOf('Instagram') != -1 ) {
        return true;
    } 

    return false;
  }


  proto.inViewLoad = function() {
    
    let that = this;
    const observer = new IntersectionObserver(function(entries) {

      entries.forEach(function(entry){

        if (entry.isIntersecting) {
          that.init();
        } 
        else {
          that.lazyInit();
        }
        observer.unobserve(entry.target);
        
      });

    }, {
      root: (this.isSafari()) ? null : document,
      rootMargin: '49%',
      threshold: 0
    });

    observer.observe(this.el);

  };

  /**
    * Play frames from specific range.
    *
    */
  proto.playFrames = function(reset) {
    
    let framePercentages = this.frame_constraint.split(',');
    framePercentages = framePercentages.map((item) => Math.floor(this.frameCount * (parseInt(item)/100)));

    // Disable on mobile
    if( this.mobile_func == 'last_frame' ) {
      this.instance.goToAndStop(framePercentages[1] - 1, true);
      return;
    }

    if( reset ) {
      this.instance.goToAndStop(framePercentages[0]);
    } else {
      this.instance.playSegments(framePercentages, true);
    }
    
  }




  let instances;

  function initLottie() {
    let lottieEls = document.querySelectorAll(".nectar-lottie");

    instances = [...lottieEls].map((el) => {
      return new NectarLottie(el);
    });

  }
  
  $(document).ready(function () {

    // Initialize.
    let usingFrontEndEditor = (typeof window.vc_iframe === 'undefined') ? false : true;
    if (!usingFrontEndEditor) {
      initLottie();
    }

    // Front end editor.
    $(window).on('vc_reload', () => {
      lottie.destroy();
      initLottie();
    });

    // Full page screen rows.
    $(window).on('fp-section-init', function(){
      instances.forEach((instance) => {
        if (instance.trigger_type == 'play') {
          
          // Active in current row
          if( $(instance.el).parents('.fp-table.active').length > 0 ) { 
            instance.playFrames();
          } else {
            // reset.
            instance.playFrames(true);
          }
            
        }
      });
    })

  });

})(jQuery);
