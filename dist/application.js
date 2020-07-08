"use strict";function _typeof(obj){"@babel/helpers - typeof";if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof=function _typeof(obj){return typeof obj}}else{_typeof=function _typeof(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj}}return _typeof(obj)}Object.defineProperty(exports,"__esModule",{value:true});exports["default"]=void 0;var _vue=_interopRequireDefault(require("vue"));var _pluginUse=_interopRequireWildcard(require("./plugin-use"));function _getRequireWildcardCache(){if(typeof WeakMap!=="function")return null;var cache=new WeakMap;_getRequireWildcardCache=function _getRequireWildcardCache(){return cache};return cache}function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj}if(obj===null||_typeof(obj)!=="object"&&typeof obj!=="function"){return{"default":obj}}var cache=_getRequireWildcardCache();if(cache&&cache.has(obj)){return cache.get(obj)}var newObj={};var hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;if(desc&&(desc.get||desc.set)){Object.defineProperty(newObj,key,desc)}else{newObj[key]=obj[key]}}}newObj["default"]=obj;if(cache){cache.set(obj,newObj)}return newObj}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}function _createClass(Constructor,protoProps,staticProps){if(protoProps)_defineProperties(Constructor.prototype,protoProps);if(staticProps)_defineProperties(Constructor,staticProps);return Constructor}var Application=/*#__PURE__*/function(){function Application(){_classCallCheck(this,Application);this.instance=null;this.pluginUseManager=new _pluginUse["default"]}_createClass(Application,[{key:"get",value:function get(){var _this=this;return new Promise(function(resolve,reject){var tryInstance=function tryInstance(){var tried=arguments.length>0&&arguments[0]!==undefined?arguments[0]:1;var maxTried=arguments.length>1&&arguments[1]!==undefined?arguments[1]:100;if(_this.instance){resolve(_this.instance);return}if(tried===maxTried){reject();return}setTimeout(function(){return tryInstance(++tried)},200)};tryInstance()})}},{key:"use",value:function use(){var _this2=this;var pluginUses=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};Object.keys(pluginUses).forEach(function(name){return _this2.pluginUseManager.use(name,pluginUses[name])});return this}},{key:"register",value:function register(handle){var register=false;_vue["default"].mixin({beforeCreate:function beforeCreate(){if(!register){register=true;handle(this)}}});return this}},{key:"pluginsReady",value:function pluginsReady(){return this.pluginUseManager.resetAttaching().ready()}},{key:"createDefault",value:function createDefault(appComponent){var appElement=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"#app";var failed=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;this.instance=new _vue["default"](Object.assign({render:function render(h){return h(appComponent)}},this.pluginUseManager.attached)).$mount(appElement)}},{key:"createFailed",value:function createFailed(appFailedComponent){var _this3=this;var appElement=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"#app";this.pluginsReady().then(function(){return _this3.pluginUseManager.ready(_pluginUse.SCOPE.failed).then(function(){return _this3.createDefault(appFailedComponent,appElement,true)})["catch"](function(){return _this3.createDefault(appFailedComponent,appElement,true)})})["catch"](function(){return _this3.createDefault(appFailedComponent,appElement,true)})}},{key:"create",value:function create(appComponent,appFailedComponent){var _this4=this;var appElement=arguments.length>2&&arguments[2]!==undefined?arguments[2]:"#app";this.pluginsReady().then(function(){return _this4.pluginUseManager.ready(_pluginUse.SCOPE["default"]).then(function(){return _this4.createDefault(appComponent,appElement)})["catch"](function(){return _this4.createFailed(appFailedComponent,appElement)})})["catch"](function(){return _this4.createFailed(appFailedComponent,appElement)})}}]);return Application}();exports["default"]=Application;
//# sourceMappingURL=application.js.map