/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 459);
/******/ })
/************************************************************************/
/******/ ({

/***/ 459:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _values = __webpack_require__(460);

/***/ }),

/***/ 460:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var defaultValues = exports.defaultValues = [['userId', (Math.random().toString(36) + '00000000000000000').slice(2, 19)], ['notifyStateChange', true], ['notifyInstallation', true], ['notifyRemoval', true], ['historyInstall', true], ['historyRemove', true], ['historyUpdate', true], ['historyEnable', true], ['historyDisable', true], ['autoState', true], ['autoStateNotification', true], ['autoStateRules', '[]'], ['sortOrder', 'nameState'], ['joinCommunity', true], ['notificationDuration_autoState', 5], ['notificationDuration_stateChange', 5], ['notificationDuration_installation', -1], ['notificationDuration_removal', -1], ['listView', true], ['sendUsage', true], ['groupList', []], ['mainColor', { r: 185, g: 7, b: 168, a: 1 }], ['subColor', { r: 0, g: 0, b: 0, a: 1 }], ['extensions', true], ['userscripts', true]];

var constantValues = exports.constantValues = [['version', '0.1.5.0']];

/***/ })

/******/ });