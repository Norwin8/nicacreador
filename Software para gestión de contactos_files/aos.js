!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.AOSAA=t():e.AOSAA=t()}(this,function(){return function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={exports:{},id:o,loaded:!1};return e[o].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="dist/",t(0)}([function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},a=n(1),r=o(a),u=n(2),c=o(u),s=n(3),f=o(s),d=n(4),l=o(d),m=n(5),p=o(m),b=n(6),v=o(b),g=n(9),y=o(g),w=[],h=!1,k=document.all&&!window.atob,x={offset:120,delay:0,easing:"ease",duration:400,disable:!1,once:!1,startEvent:"DOMContentLoaded",initialClass:"animated"},j=function(){var e=!(arguments.length<=0||void 0===arguments[0])&&arguments[0];if(e&&(h=!0),h)return w=(0,v["default"])(w,x),(0,p["default"])(w,x.once),w},O=function(){w=(0,y["default"])(),j()},A=function(){w.forEach(function(e,t){e.node.removeAttribute("data-aosaa"),e.node.removeAttribute("data-aosaa-easing"),e.node.removeAttribute("data-aosaa-duration"),e.node.removeAttribute("data-aosaa-delay")})},_=function(e){return e===!0||"mobile"===e&&l["default"].mobile()||"phone"===e&&l["default"].phone()||"tablet"===e&&l["default"].tablet()||"function"==typeof e&&e()===!0},S=function(e){return x=i(x,e),w=(0,y["default"])(),_(x.disable)||k?A():(document.querySelector("body").setAttribute("data-aosaa-easing",x.easing),document.querySelector("body").setAttribute("data-aosaa-duration",x.duration),document.querySelector("body").setAttribute("data-aosaa-delay",x.delay),"DOMContentLoaded"===x.startEvent&&["complete","interactive"].indexOf(document.readyState)>-1?j(!0):document.addEventListener(x.startEvent,function(){j(!0)}),window.addEventListener("resize",(0,c["default"])(j,50,!0)),window.addEventListener("orientationchange",(0,c["default"])(j,50,!0)),window.addEventListener("scroll",(0,r["default"])(function(){(0,p["default"])(w,x.once)},99)),document.addEventListener("DOMNodeRemoved",function(e){var t=e.target;t&&1===t.nodeType&&t.hasAttribute&&t.hasAttribute("data-aosaa")&&(0,c["default"])(O,50,!0)}),(0,f["default"])("[data-aosaa]",O),w)};e.exports={init:S,refresh:j,refreshHard:O}},function(e,t){"use strict";function n(){return Date.now()}function o(e,t,o){function i(t){var n=v,o=g;return v=g=void 0,x=t,w=e.apply(o,n)}function a(e){return x=e,h=setTimeout(f,t),A?i(e):w}function u(e){var n=e-k,o=e-x,i=t-n;return _?O(i,y-o):i}function c(e){var n=e-k,o=e-x;return void 0===k||n>=t||n<0||_&&o>=y}function f(){var e=n();return c(e)?l(e):void(h=setTimeout(f,u(e)))}function l(e){return h=void 0,S&&v?i(e):(v=g=void 0,w)}function m(){void 0!==h&&clearTimeout(h),x=0,v=k=g=h=void 0}function p(){return void 0===h?w:l(n())}function b(){var e=n(),o=c(e);if(v=arguments,g=this,k=e,o){if(void 0===h)return a(k);if(_)return h=setTimeout(f,t),i(k)}return void 0===h&&(h=setTimeout(f,t)),w}var v,g,y,w,h,k,x=0,A=!1,_=!1,S=!0;if("function"!=typeof e)throw new TypeError(d);return t=s(t)||0,r(o)&&(A=!!o.leading,_="maxWait"in o,y=_?j(s(o.maxWait)||0,t):y,S="trailing"in o?!!o.trailing:S),b.cancel=m,b.flush=p,b}function i(e,t,n){var i=!0,a=!0;if("function"!=typeof e)throw new TypeError(d);return r(n)&&(i="leading"in n?!!n.leading:i,a="trailing"in n?!!n.trailing:a),o(e,t,{leading:i,maxWait:t,trailing:a})}function a(e){var t=r(e)?x.call(e):"";return t==m||t==p}function r(e){var t="undefined"==typeof e?"undefined":f(e);return!!e&&("object"==t||"function"==t)}function u(e){return!!e&&"object"==("undefined"==typeof e?"undefined":f(e))}function c(e){return"symbol"==("undefined"==typeof e?"undefined":f(e))||u(e)&&x.call(e)==b}function s(e){if("number"==typeof e)return e;if(c(e))return l;if(r(e)){var t=a(e.valueOf)?e.valueOf():e;e=r(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(v,"");var n=y.test(e);return n||w.test(e)?h(e.slice(2),n?2:8):g.test(e)?l:+e}var f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},d="Expected a function",l=NaN,m="[object Function]",p="[object GeneratorFunction]",b="[object Symbol]",v=/^\s+|\s+$/g,g=/^[-+]0x[0-9a-f]+$/i,y=/^0b[01]+$/i,w=/^0o[0-7]+$/i,h=parseInt,k=Object.prototype,x=k.toString,j=Math.max,O=Math.min;e.exports=i},function(e,t){"use strict";function n(){return Date.now()}function o(e,t,o){function i(t){var n=v,o=g;return v=g=void 0,O=t,w=e.apply(o,n)}function r(e){return O=e,h=setTimeout(d,t),A?i(e):w}function u(e){var n=e-k,o=e-O,i=t-n;return _?j(i,y-o):i}function s(e){var n=e-k,o=e-O;return void 0===k||n>=t||n<0||_&&o>=y}function d(){var e=n();return s(e)?l(e):void(h=setTimeout(d,u(e)))}function l(e){return h=void 0,S&&v?i(e):(v=g=void 0,w)}function m(){void 0!==h&&clearTimeout(h),O=0,v=k=g=h=void 0}function p(){return void 0===h?w:l(n())}function b(){var e=n(),o=s(e);if(v=arguments,g=this,k=e,o){if(void 0===h)return r(k);if(_)return h=setTimeout(d,t),i(k)}return void 0===h&&(h=setTimeout(d,t)),w}var v,g,y,w,h,k,O=0,A=!1,_=!1,S=!0;if("function"!=typeof e)throw new TypeError(f);return t=c(t)||0,a(o)&&(A=!!o.leading,_="maxWait"in o,y=_?x(c(o.maxWait)||0,t):y,S="trailing"in o?!!o.trailing:S),b.cancel=m,b.flush=p,b}function i(e){var t=a(e)?k.call(e):"";return t==l||t==m}function a(e){var t="undefined"==typeof e?"undefined":s(e);return!!e&&("object"==t||"function"==t)}function r(e){return!!e&&"object"==("undefined"==typeof e?"undefined":s(e))}function u(e){return"symbol"==("undefined"==typeof e?"undefined":s(e))||r(e)&&k.call(e)==p}function c(e){if("number"==typeof e)return e;if(u(e))return d;if(a(e)){var t=i(e.valueOf)?e.valueOf():e;e=a(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(b,"");var n=g.test(e);return n||y.test(e)?w(e.slice(2),n?2:8):v.test(e)?d:+e}var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},f="Expected a function",d=NaN,l="[object Function]",m="[object GeneratorFunction]",p="[object Symbol]",b=/^\s+|\s+$/g,v=/^[-+]0x[0-9a-f]+$/i,g=/^0b[01]+$/i,y=/^0o[0-7]+$/i,w=parseInt,h=Object.prototype,k=h.toString,x=Math.max,j=Math.min;e.exports=o},function(e,t){"use strict";function n(e,t){r.push({selector:e,fn:t}),!u&&a&&(u=new a(o),u.observe(i.documentElement,{childList:!0,subtree:!0,removedNodes:!0})),o()}function o(){for(var e,t,n=0,o=r.length;n<o;n++){e=r[n],t=i.querySelectorAll(e.selector);for(var a,u=0,c=t.length;u<c;u++)a=t[u],a.ready||(a.ready=!0,e.fn.call(a,a))}}Object.defineProperty(t,"__esModule",{value:!0});var i=window.document,a=window.MutationObserver||window.WebKitMutationObserver,r=[],u=void 0;t["default"]=n},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=function(){function e(){n(this,e)}return o(e,[{key:"phone",value:function(){var e=!1;return function(t){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4)))&&(e=!0)}(navigator.userAgent||navigator.vendor||window.opera),e}},{key:"mobile",value:function(){var e=!1;return function(t){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4)))&&(e=!0)}(navigator.userAgent||navigator.vendor||window.opera),e}},{key:"tablet",value:function(){return this.mobile()&&!this.phone()}}]),e}();t["default"]=new i},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e,t,n){var o=e.node.getAttribute("data-aosaa-once"),i=e.node.getAttribute("data-aosaa");t>e.position?e.node.classList.add(i):"undefined"!=typeof o&&("false"===o||!n&&"true"!==o)&&e.node.classList.remove(i)},o=function(e,t){var o=window.pageYOffset,i=window.innerHeight;e.forEach(function(e,a){n(e,i+o,t)})};t["default"]=o},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var i=n(7),a=o(i),r=function(e,t){return e.forEach(function(e,n){e.node.classList.add(t.initialClass),e.position=(0,a["default"])(e.node,t.offset)}),e};t["default"]=r},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var i=n(8),a=o(i),r=function(e,t){var n=0,o=0,i=window.innerHeight,r={offset:e.getAttribute("data-aos-offset"),anchor:e.getAttribute("data-aos-anchor"),anchorPlacement:e.getAttribute("data-aos-anchor-placement")};switch(r.offset&&!isNaN(r.offset)&&(o=parseInt(r.offset)),r.anchor&&document.querySelectorAll(r.anchor)&&(e=document.querySelectorAll(r.anchor)[0]),n=(0,a["default"])(e).top,r.anchorPlacement){case"top-bottom":break;case"center-bottom":n+=e.offsetHeight/2;break;case"bottom-bottom":n+=e.offsetHeight;break;case"top-center":n+=i/2;break;case"bottom-center":n+=i/2+e.offsetHeight;break;case"center-center":n+=i/2+e.offsetHeight/2;break;case"top-top":n+=i;break;case"bottom-top":n+=e.offsetHeight+i;break;case"center-top":n+=e.offsetHeight/2+i}return r.anchorPlacement||r.offset||isNaN(t)||(o=t),n+o};t["default"]=r},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){for(var t=0,n=0;e&&!isNaN(e.offsetLeft)&&!isNaN(e.offsetTop);)t+=e.offsetLeft-("BODY"!=e.tagName?e.scrollLeft:0),n+=e.offsetTop-("BODY"!=e.tagName?e.scrollTop:0),e=e.offsetParent;return{top:n,left:t}};t["default"]=n},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){e=e||document.querySelectorAll("[data-aosaa]");var t=[];return[].forEach.call(e,function(e,n){t.push({node:e})}),t};t["default"]=n}])});
//# sourceMappingURL=aosaa.js.map