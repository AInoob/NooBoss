/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _defaultValues = __webpack_require__(1);

	var _options = __webpack_require__(2);

	var _Util = __webpack_require__(3);

	var _Util2 = _interopRequireDefault(_Util);

	var _Management = __webpack_require__(4);

	var _Management2 = _interopRequireDefault(_Management);

	var _listeners = __webpack_require__(5);

	var _listeners2 = _interopRequireDefault(_listeners);

	var _History = __webpack_require__(6);

	var _History2 = _interopRequireDefault(_History);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var NooBoss = {};

	window.NooBoss = NooBoss;

	NooBoss.defaultValues = _defaultValues.defaultValues;

	NooBoss.resetSettings = _options.resetSettings.bind(NooBoss);

	NooBoss.resetIndexedDB = _options.resetIndexedDB.bind(NooBoss, function () {
	  NooBoss.Management.init();
	  NooBoss.History.init();
	});

	NooBoss.initDefaultValues = _options.initDefaultValues;

	NooBoss.Util = _Util2.default;

	_Management2.default.updateAppInfo = _Management2.default.updateAppInfo.bind(NooBoss);
	NooBoss.Management = _Management2.default;

	_listeners2.default.onEnabled = _listeners2.default.onEnabled.bind(NooBoss);
	NooBoss.listeners = _listeners2.default;

	_History2.default.init = _History2.default.init.bind(NooBoss);
	_History2.default.addRecord = _History2.default.addRecord.bind(NooBoss);
	_History2.default.listen = _History2.default.listen.bind(NooBoss);
	NooBoss.History = _History2.default;

	NooBoss.init = function () {
	  NooBoss.initDefaultValues();
	  //a very bad practice, but yeah.
	  setTimeout(function () {
	    NooBoss.History.init();
	    NooBoss.History.listen();
	    NooBoss.Management.init();
	  }, 333);
	};

	document.addEventListener('DOMContentLoaded', function () {
	  NooBoss.init();
	  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	    if ('job' in request) {
	      if (request.job == 'reset') {
	        NooBoss.resetSettings();
	        NooBoss.resetIndexedDB();
	      } else if (request.job == 'clearHistory') {
	        NooBoss.History.init();
	      } else if (request.job == 'autoState') {
	        isOn('autoState', NooBoss.Management.autoState.enable, NooBoss.Management.autoState.disable);
	      } else if (request.job == 'updateAutoStateRules') {
	        NooBoss.Management.autoState.updateRules();
	      } else if (request.job == 'updateGroupList') {
	        NooBoss.Management.updateGroupList();
	      }
	    }
	  });
	});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var defaultValues = [['userId', (Math.random().toString(36) + '00000000000000000').slice(2, 19)], ['showAds', false], ['notifyStateChange', true], ['notifyInstallation', true], ['notifyRemoval', true], ['historyInstall', true], ['historyRemove', true], ['historyUpdate', true], ['historyEnable', true], ['historyDisable', true], ['autoState', true], ['autoStateNotification', true], ['autoStateRules', '[]'], ['sortOrder', 'nameState'], ['recoExtensions', true], ['defaultPage', 'manage'], ['notificationDuration_autoState', 5], ['notificationDuration_stateChange', 5], ['notificationDuration_installation', -1], ['notificationDuration_removal', -1], ['listView', true], ['sendUsage', true], ['groupList', []]];

	exports.defaultValues = defaultValues;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function resetSettings() {
	  var temp = void 0;
	  for (var i = 1; i < NooBoss.defaultValues.length; i++) {
	    temp = this.defaultValues[i];
	    set(temp[0], temp[1]);
	  }
	}

	function resetIndexedDB(callback) {
	  var req = window.indexedDB.deleteDatabase('NooBoss');
	  req.onerror = function (e) {
	    console.log(e);
	  };
	  if (callback) {
	    req.onsuccess = callback;
	  }
	}

	function initDefaultValues() {
	  var temp = void 0;
	  for (var i = 0; i < this.defaultValues.length; i++) {
	    temp = this.defaultValues[i];
	    setIfNull(temp[0], temp[1]);
	  }
	}

	exports.resetSettings = resetSettings;
	exports.resetIndexedDB = resetIndexedDB;
	exports.initDefaultValues = initDefaultValues;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Util = {};

	Util.getIcon = function (appInfo, callback) {
	  var iconUrl = undefined;
	  if (appInfo.icons) {
	    var maxSize = 0;
	    for (var j = 0; j < appInfo.icons.length; j++) {
	      var iconInfo = appInfo.icons[j];
	      if (iconInfo.size > maxSize) {
	        maxSize = iconInfo.size;
	        iconUrl = iconInfo.url;
	      }
	    }
	  }
	  if (!iconUrl) {
	    var canvas = document.createElement("canvas");
	    canvas.width = 128;
	    canvas.height = 128;
	    var ctx = canvas.getContext('2d');
	    ctx.font = "120px Arial";
	    ctx.fillStyle = "grey";
	    ctx.fillRect(0, 0, canvas.width, canvas.height);
	    ctx.fillStyle = "white";
	    ctx.fillText(appInfo.name[0], 22, 110);
	    var dataUrl = canvas.toDataURL();
	    callback(dataUrl);
	  } else {
	    dataUrlFromUrl(iconUrl, callback);
	  }
	};

	exports.default = Util;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var Management = {};

	Management.autoState = {};

	Management.autoState.enable = function () {
	  Management.autoState.init();
	  chrome.tabs.onCreated.addListener(function (tab) {
	    Management.autoState.newTab(tab);
	  });
	  chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
	    Management.autoState.updateTab(tabId, info, tab);
	  });
	  chrome.tabs.onRemoved.addListener(function (tabId) {
	    Management.autoState.removeTab(tabId);
	  });
	  chrome.tabs.onReplaced.addListener(function (addedTabId, removedTabId) {
	    Management.autoState.tabs[removedTabId] = null;
	    chrome.tabs.get(addedTabId, function (tab) {
	      Management.autoState.newTab(tab);
	    });
	  });
	};

	Management.autoState.newTab = function (tab) {
	  Management.autoState.tabs[tab.id] = tab.url;
	  Management.autoState.manage(tab.id);
	};

	Management.autoState.updateTab = function (tabId, changeInfo, tab) {
	  if (changeInfo.url) {
	    var oldUrl = (Management.autoState.tabs[tabId] || {}).url;
	    if (oldUrl != changeInfo.url) {
	      Management.autoState.tabs[tabId] = changeInfo.url;
	      Management.autoState.manage(tabId);
	    }
	  }
	};

	Management.autoState.removeTab = function (tabId) {
	  Management.autoState.tabs[tabId] = null;
	  Management.autoState.manage(tabId);
	};

	Management.autoState.disable = function () {
	  chrome.tabs.onCreated.removeListener();
	  chrome.tabs.onUpdated.removeListener();
	  chrome.tabs.onRemoved.removeListener();
	  chrome.tabs.onReplaced.removeListener();
	};

	Management.autoState.getRegExp = function (expr, isWildcard) {
	  if (!isWildcard) {
	    return new RegExp(expr, 'i');
	  } else {
	    // via Greasemonkey/content/convert2RegExp.js
	    // Converts a pattern in this programs simple notation to a regular expression.
	    // thanks AdBlock! http://www.mozdev.org/source/browse/adblock/adblock/
	    var s = new String(expr);
	    var res = new String("^");
	    for (var i = 0; i < s.length; i++) {
	      switch (s[i]) {
	        case "*":
	          res += ".*";
	          break;
	        case ".":
	        case "?":
	        case "^":
	        case "$":
	        case "+":
	        case "{":
	        case "[":
	        case "|":
	        case "(":
	        case ")":
	        case "]":
	          res += "\\" + s[i];
	          break;
	        case "\\":
	          res += "\\\\";
	          break;
	        case " ":
	          break;
	        default:
	          res += s[i];
	          break;
	      }
	    }
	    var tldRegExp = new RegExp("^(\\^(?:[^/]*)(?://)?(?:[^/]*))(\\\\\\.tld)((?:/.*)?)$");
	    var tldRes = res.match(tldRegExp);
	    if (tldRes) {
	      var tldStr = "\.(?:demon\\.co\\.uk|esc\\.edu\\.ar|(?:c[oi]\\.)?[^\\.]\\.(?:vt|ne|ks|il|hi|sc|nh|ia|wy|or|ma|vi|tn|in|az|id|nc|co|dc|nd|me|al|ak|de|wv|nm|mo|pr|nj|sd|md|va|ri|ut|ct|pa|ok|ky|mt|ga|la|oh|ms|wi|wa|gu|mi|tx|fl|ca|ar|mn|ny|nv)\\.us|[^\\.]\\.(?:(?:pvt\\.)?k12|cc|tec|lib|state|gen)\\.(?:vt|ne|ks|il|hi|sc|nh|ia|wy|or|ma|vi|tn|in|az|id|nc|co|dc|nd|me|al|ak|de|wv|nm|mo|pr|nj|sd|md|va|ri|ut|ct|pa|ok|ky|mt|ga|la|oh|ms|wi|wa|gu|mi|tx|fl|ca|ar|mn|ny|nv)\\.us|[^\\.]\\.vt|ne|ks|il|hi|sc|nh|ia|wy|or|ma|vi|tn|in|az|id|nc|co|dc|nd|me|al|ak|de|wv|nm|mo|pr|nj|sd|md|va|ri|ut|ct|pa|ok|ky|mt|ga|la|oh|ms|wi|wa|gu|mi|tx|fl|ca|ar|mn|ny|nvus|ne|gg|tr|mm|ki|biz|sj|my|hn|gl|ro|tn|co|br|coop|cy|bo|ck|tc|bv|ke|aero|cs|dm|km|bf|af|mv|ls|tm|jm|pg|ky|ga|pn|sv|mq|hu|za|se|uy|iq|ai|com|ve|na|ba|ph|xxx|no|lv|tf|kz|ma|in|id|si|re|om|by|fi|gs|ir|li|tz|td|cg|pa|am|tv|jo|bi|ee|cd|pk|mn|gd|nz|as|lc|ae|cn|ag|mx|sy|cx|cr|vi|sg|bm|kh|nr|bz|vu|kw|gf|al|uz|eh|int|ht|mw|gm|bg|gu|info|aw|gy|ac|ca|museum|sk|ax|es|kp|bb|sa|et|ie|tl|org|tj|cf|im|mk|de|pro|md|fm|cl|jp|bn|vn|gp|sm|ar|dj|bd|mc|ug|nu|ci|dk|nc|rw|aq|name|st|hm|mo|gq|ps|ge|ao|gr|va|is|mt|gi|la|bh|ms|bt|gb|it|wf|sb|ly|ng|gt|lu|il|pt|mh|eg|kg|pf|um|fr|sr|vg|fj|py|pm|sn|sd|au|sl|gh|us|mr|dz|ye|kn|cm|arpa|bw|lk|mg|tk|su|sc|ru|travel|az|ec|mz|lb|ml|bj|edu|pr|fk|lr|nf|np|do|mp|bs|to|cu|ch|yu|eu|mu|ni|pw|pl|gov|pe|an|ua|uk|gw|tp|kr|je|tt|net|fo|jobs|yt|cc|sh|io|zm|hk|th|so|er|cz|lt|mil|hr|gn|be|qa|cv|vc|tw|ws|ad|sz|at|tg|zw|nl|info\\.tn|org\\.sd|med\\.sd|com\\.hk|org\\.ai|edu\\.sg|at\\.tt|mail\\.pl|net\\.ni|pol\\.dz|hiroshima\\.jp|org\\.bh|edu\\.vu|net\\.im|ernet\\.in|nic\\.tt|com\\.tn|go\\.cr|jersey\\.je|bc\\.ca|com\\.la|go\\.jp|com\\.uy|tourism\\.tn|com\\.ec|conf\\.au|dk\\.org|shizuoka\\.jp|ac\\.vn|matsuyama\\.jp|agro\\.pl|yamaguchi\\.jp|edu\\.vn|yamanashi\\.jp|mil\\.in|sos\\.pl|bj\\.cn|net\\.au|ac\\.ae|psi\\.br|sch\\.ng|org\\.mt|edu\\.ai|edu\\.ck|ac\\.yu|org\\.ws|org\\.ng|rel\\.pl|uk\\.tt|com\\.py|aomori\\.jp|co\\.ug|video\\.hu|net\\.gg|org\\.pk|id\\.au|gov\\.zw|mil\\.tr|net\\.tn|org\\.ly|re\\.kr|mil\\.ye|mil\\.do|com\\.bb|net\\.vi|edu\\.na|co\\.za|asso\\.re|nom\\.pe|edu\\.tw|name\\.et|jl\\.cn|gov\\.ye|ehime\\.jp|miyazaki\\.jp|kanagawa\\.jp|gov\\.au|nm\\.cn|he\\.cn|edu\\.sd|mod\\.om|web\\.ve|edu\\.hk|medecin\\.fr|org\\.cu|info\\.au|edu\\.ve|nx\\.cn|alderney\\.gg|net\\.cu|org\\.za|mb\\.ca|com\\.ye|edu\\.pa|fed\\.us|ac\\.pa|alt\\.na|mil\\.lv|fukuoka\\.jp|gen\\.in|gr\\.jp|gov\\.br|gov\\.ac|id\\.fj|fukui\\.jp|hu\\.com|org\\.gu|net\\.ae|mil\\.ph|ltd\\.je|alt\\.za|gov\\.np|edu\\.jo|net\\.gu|g12\\.br|org\\.tn|store\\.co|fin\\.tn|ac\\.nz|gouv\\.fr|gov\\.il|org\\.ua|org\\.do|org\\.fj|sci\\.eg|gov\\.tt|cci\\.fr|tokyo\\.jp|net\\.lv|gov\\.lc|ind\\.br|ca\\.tt|gos\\.pk|hi\\.cn|net\\.do|co\\.tv|web\\.co|com\\.pa|com\\.ng|ac\\.ma|gov\\.bh|org\\.zw|csiro\\.au|lakas\\.hu|gob\\.ni|gov\\.fk|org\\.sy|gov\\.lb|gov\\.je|ed\\.cr|nb\\.ca|net\\.uy|com\\.ua|media\\.hu|com\\.lb|nom\\.pl|org\\.br|hk\\.cn|co\\.hu|org\\.my|gov\\.dz|sld\\.pa|gob\\.pk|net\\.uk|guernsey\\.gg|nara\\.jp|telememo\\.au|k12\\.tr|org\\.nz|pub\\.sa|edu\\.ac|com\\.dz|edu\\.lv|edu\\.pk|com\\.ph|net\\.na|net\\.et|id\\.lv|au\\.com|ac\\.ng|com\\.my|net\\.cy|unam\\.na|nom\\.za|net\\.np|info\\.pl|priv\\.hu|rec\\.ve|ac\\.uk|edu\\.mm|go\\.ug|ac\\.ug|co\\.dk|net\\.tt|oita\\.jp|fi\\.cr|org\\.ac|aichi\\.jp|org\\.tt|edu\\.bh|us\\.com|ac\\.kr|js\\.cn|edu\\.ni|com\\.mt|fam\\.pk|experts-comptables\\.fr|or\\.kr|org\\.au|web\\.pk|mil\\.jo|biz\\.pl|org\\.np|city\\.hu|org\\.uy|auto\\.pl|aid\\.pl|bib\\.ve|mo\\.cn|br\\.com|dns\\.be|sh\\.cn|org\\.mo|com\\.sg|me\\.uk|gov\\.kw|eun\\.eg|kagoshima\\.jp|ln\\.cn|seoul\\.kr|school\\.fj|com\\.mk|e164\\.arpa|rnu\\.tn|pro\\.ae|org\\.om|gov\\.my|net\\.ye|gov\\.do|co\\.im|org\\.lb|plc\\.co\\.im|net\\.jp|go\\.id|net\\.tw|gov\\.ai|tlf\\.nr|ac\\.im|com\\.do|net\\.py|tozsde\\.hu|com\\.na|tottori\\.jp|net\\.ge|gov\\.cn|org\\.bb|net\\.bs|ac\\.za|rns\\.tn|biz\\.pk|gov\\.ge|org\\.uk|org\\.fk|nhs\\.uk|net\\.bh|tm\\.za|co\\.nz|gov\\.jp|jogasz\\.hu|shop\\.pl|media\\.pl|chiba\\.jp|city\\.za|org\\.ck|net\\.id|com\\.ar|gon\\.pk|gov\\.om|idf\\.il|net\\.cn|prd\\.fr|co\\.in|or\\.ug|red\\.sv|edu\\.lb|k12\\.ec|gx\\.cn|net\\.nz|info\\.hu|ac\\.zw|info\\.tt|com\\.ws|org\\.gg|com\\.et|ac\\.jp|ac\\.at|avocat\\.fr|org\\.ph|sark\\.gg|org\\.ve|tm\\.pl|net\\.pg|gov\\.co|com\\.lc|film\\.hu|ishikawa\\.jp|hotel\\.hu|hl\\.cn|edu\\.ge|com\\.bm|ac\\.om|tec\\.ve|edu\\.tr|cq\\.cn|com\\.pk|firm\\.in|inf\\.br|gunma\\.jp|gov\\.tn|oz\\.au|nf\\.ca|akita\\.jp|net\\.sd|tourism\\.pl|net\\.bb|or\\.at|idv\\.tw|dni\\.us|org\\.mx|conf\\.lv|net\\.jo|nic\\.in|info\\.vn|pe\\.kr|tw\\.cn|org\\.eg|ad\\.jp|hb\\.cn|kyonggi\\.kr|bourse\\.za|org\\.sb|gov\\.gg|net\\.br|mil\\.pe|kobe\\.jp|net\\.sa|edu\\.mt|org\\.vn|yokohama\\.jp|net\\.il|ac\\.cr|edu\\.sb|nagano\\.jp|travel\\.pl|gov\\.tr|com\\.sv|co\\.il|rec\\.br|biz\\.om|com\\.mm|com\\.az|org\\.vu|edu\\.ng|com\\.mx|info\\.co|realestate\\.pl|mil\\.sh|yamagata\\.jp|or\\.id|org\\.ae|greta\\.fr|k12\\.il|com\\.tw|gov\\.ve|arts\\.ve|cul\\.na|gov\\.kh|org\\.bm|etc\\.br|or\\.th|ch\\.vu|de\\.tt|ind\\.je|org\\.tw|nom\\.fr|co\\.tt|net\\.lc|intl\\.tn|shiga\\.jp|pvt\\.ge|gov\\.ua|org\\.pe|net\\.kh|co\\.vi|iwi\\.nz|biz\\.vn|gov\\.ck|edu\\.eg|zj\\.cn|press\\.ma|ac\\.in|eu\\.tt|art\\.do|med\\.ec|bbs\\.tr|gov\\.uk|edu\\.ua|eu\\.com|web\\.do|szex\\.hu|mil\\.kh|gen\\.nz|okinawa\\.jp|mob\\.nr|edu\\.ws|edu\\.sv|xj\\.cn|net\\.ru|dk\\.tt|erotika\\.hu|com\\.sh|cn\\.com|edu\\.pl|com\\.nc|org\\.il|arts\\.co|chirurgiens-dentistes\\.fr|net\\.pa|takamatsu\\.jp|net\\.ng|org\\.hu|net\\.in|net\\.vu|gen\\.tr|shop\\.hu|com\\.ae|tokushima\\.jp|za\\.com|gov\\.eg|co\\.jp|uba\\.ar|net\\.my|biz\\.et|art\\.br|ac\\.fk|gob\\.pe|com\\.bs|co\\.ae|de\\.net|net\\.eg|hyogo\\.jp|edunet\\.tn|museum\\.om|nom\\.ve|rnrt\\.tn|hn\\.cn|com\\.fk|edu\\.dz|ne\\.kr|co\\.je|sch\\.uk|priv\\.pl|sp\\.br|net\\.hk|name\\.vn|com\\.sa|edu\\.bm|qc\\.ca|bolt\\.hu|per\\.kh|sn\\.cn|mil\\.id|kagawa\\.jp|utsunomiya\\.jp|erotica\\.hu|gd\\.cn|net\\.tr|edu\\.np|asn\\.au|com\\.gu|ind\\.tn|mil\\.br|net\\.lb|nom\\.co|org\\.la|mil\\.pl|ac\\.il|gov\\.jo|com\\.kw|edu\\.sh|otc\\.au|gmina\\.pl|per\\.sg|gov\\.mo|int\\.ve|news\\.hu|sec\\.ps|ac\\.pg|health\\.vn|sex\\.pl|net\\.nc|qc\\.com|idv\\.hk|org\\.hk|gok\\.pk|com\\.ac|tochigi\\.jp|gsm\\.pl|law\\.za|pro\\.vn|edu\\.pe|info\\.et|sch\\.gg|com\\.vn|gov\\.bm|com\\.cn|mod\\.uk|gov\\.ps|toyama\\.jp|gv\\.at|yk\\.ca|org\\.et|suli\\.hu|edu\\.my|org\\.mm|co\\.yu|int\\.ar|pe\\.ca|tm\\.hu|net\\.sb|org\\.yu|com\\.ru|com\\.pe|edu\\.kh|edu\\.kw|org\\.qa|med\\.om|net\\.ws|org\\.in|turystyka\\.pl|store\\.ve|org\\.bs|mil\\.uy|net\\.ar|iwate\\.jp|org\\.nc|us\\.tt|gov\\.sh|nom\\.fk|go\\.th|gov\\.ec|com\\.br|edu\\.do|gov\\.ng|pro\\.tt|sapporo\\.jp|net\\.ua|tm\\.fr|com\\.lv|com\\.mo|edu\\.uk|fin\\.ec|edu\\.ps|ru\\.com|edu\\.ec|ac\\.fj|net\\.mm|veterinaire\\.fr|nom\\.re|ingatlan\\.hu|fr\\.vu|ne\\.jp|int\\.co|gov\\.cy|org\\.lv|de\\.com|nagasaki\\.jp|com\\.sb|gov\\.za|org\\.lc|com\\.fj|ind\\.in|or\\.cr|sc\\.cn|chambagri\\.fr|or\\.jp|forum\\.hu|tmp\\.br|reklam\\.hu|gob\\.sv|com\\.pl|saitama\\.jp|name\\.tt|niigata\\.jp|sklep\\.pl|nom\\.ni|co\\.ma|net\\.la|co\\.om|pharmacien\\.fr|port\\.fr|mil\\.gu|au\\.tt|edu\\.gu|ngo\\.ph|com\\.ve|ac\\.th|gov\\.fj|barreau\\.fr|net\\.ac|ac\\.je|org\\.kw|sport\\.hu|ac\\.cn|net\\.bm|ibaraki\\.jp|tel\\.no|org\\.cy|edu\\.mo|gb\\.net|kyoto\\.jp|sch\\.sa|com\\.au|edu\\.lc|fax\\.nr|gov\\.mm|it\\.tt|org\\.jo|nat\\.tn|mil\\.ve|be\\.tt|org\\.az|rec\\.co|co\\.ve|gifu\\.jp|net\\.th|hokkaido\\.jp|ac\\.gg|go\\.kr|edu\\.ye|qh\\.cn|ab\\.ca|org\\.cn|no\\.com|co\\.uk|gov\\.gu|de\\.vu|miasta\\.pl|kawasaki\\.jp|co\\.cr|miyagi\\.jp|org\\.jp|osaka\\.jp|web\\.za|net\\.za|gov\\.pk|gov\\.vn|agrar\\.hu|asn\\.lv|org\\.sv|net\\.sh|org\\.sa|org\\.dz|assedic\\.fr|com\\.sy|net\\.ph|mil\\.ge|es\\.tt|mobile\\.nr|co\\.kr|ltd\\.uk|ac\\.be|fgov\\.be|geek\\.nz|ind\\.gg|net\\.mt|maori\\.nz|ens\\.tn|edu\\.py|gov\\.sd|gov\\.qa|nt\\.ca|com\\.pg|org\\.kh|pc\\.pl|com\\.eg|net\\.ly|se\\.com|gb\\.com|edu\\.ar|sch\\.je|mil\\.ac|mil\\.ar|okayama\\.jp|gov\\.sg|ac\\.id|co\\.id|com\\.ly|huissier-justice\\.fr|nic\\.im|gov\\.lv|nu\\.ca|org\\.sg|com\\.kh|org\\.vi|sa\\.cr|lg\\.jp|ns\\.ca|edu\\.co|gov\\.im|edu\\.om|net\\.dz|org\\.pl|pp\\.ru|tm\\.mt|org\\.ar|co\\.gg|org\\.im|edu\\.qa|org\\.py|edu\\.uy|targi\\.pl|com\\.ge|gub\\.uy|gov\\.ar|ltd\\.gg|fr\\.tt|net\\.qa|com\\.np|ass\\.dz|se\\.tt|com\\.ai|org\\.ma|plo\\.ps|co\\.at|med\\.sa|net\\.sg|kanazawa\\.jp|com\\.fr|school\\.za|net\\.pl|ngo\\.za|net\\.sy|ed\\.jp|org\\.na|net\\.ma|asso\\.fr|police\\.uk|powiat\\.pl|govt\\.nz|sk\\.ca|tj\\.cn|mil\\.ec|com\\.jo|net\\.mo|notaires\\.fr|avoues\\.fr|aeroport\\.fr|yn\\.cn|gov\\.et|gov\\.sa|gov\\.ae|com\\.tt|art\\.dz|firm\\.ve|com\\.sd|school\\.nz|edu\\.et|gob\\.pa|telecom\\.na|ac\\.cy|gz\\.cn|net\\.kw|mobil\\.nr|nic\\.uk|co\\.th|com\\.vu|com\\.re|belgie\\.be|nl\\.ca|uk\\.com|com\\.om|utazas\\.hu|presse\\.fr|co\\.ck|xz\\.cn|org\\.tr|mil\\.co|edu\\.cn|net\\.ec|on\\.ca|konyvelo\\.hu|gop\\.pk|net\\.om|info\\.ve|com\\.ni|sa\\.com|com\\.tr|sch\\.sd|fukushima\\.jp|tel\\.nr|atm\\.pl|kitakyushu\\.jp|com\\.qa|firm\\.co|edu\\.tt|games\\.hu|mil\\.nz|cri\\.nz|net\\.az|org\\.ge|mie\\.jp|net\\.mx|sch\\.ae|nieruchomosci\\.pl|int\\.vn|edu\\.za|com\\.cy|wakayama\\.jp|gov\\.hk|org\\.pa|edu\\.au|gov\\.in|pro\\.om|2000\\.hu|szkola\\.pl|shimane\\.jp|co\\.zw|gove\\.tw|com\\.co|net\\.ck|net\\.pk|net\\.ve|org\\.ru|uk\\.net|org\\.co|uu\\.mt|com\\.cu|mil\\.za|plc\\.uk|lkd\\.co\\.im|gs\\.cn|sex\\.hu|net\\.je|kumamoto\\.jp|mil\\.lb|edu\\.yu|gov\\.ws|sendai\\.jp|eu\\.org|ah\\.cn|net\\.vn|gov\\.sb|net\\.pe|nagoya\\.jp|geometre-expert\\.fr|net\\.fk|biz\\.tt|org\\.sh|edu\\.sa|saga\\.jp|sx\\.cn|org\\.je|org\\.ye|muni\\.il|kochi\\.jp|com\\.bh|org\\.ec|priv\\.at|gov\\.sy|org\\.ni|casino\\.hu|res\\.in|uy\\.com)";
	      res = tldRes[1] + tldStr + tldRes[3];
	    }
	    return new RegExp(res + "$", "i");
	  }
	};

	// find those that the status need to be changed, and change their state at the end
	Management.autoState.manage = function (tabId) {
	  var autoState = Management.autoState;
	  var tabs = autoState.tabs;
	  var nextPhases = {};
	  var enableOnlys = {};
	  var disableOnlys = {};

	  var _loop = function _loop(i) {
	    var rule = autoState.rules[i];
	    var appIds = rule.ids;
	    var pattern = Management.autoState.getRegExp(rule.match.url, rule.match.isWildcard);
	    var tabIds = Object.keys(tabs);
	    var matched = false;
	    for (var j = 0; j < tabIds.length; j++) {
	      var url = tabs[tabIds[j]];
	      if (pattern.exec(url)) {
	        matched = true;
	        break;
	      }
	    }
	    switch (rule.action) {
	      case 'enableOnly':
	        if (matched) {
	          var _loop2 = function _loop2(k) {
	            if (appIds[k].match(/^NooBoss-Group/)) {
	              var group = Management.groupList.filter(function (group) {
	                return group.id == appIds[k];
	              })[0];
	              if (!group) {
	                return {
	                  v: {
	                    v: void 0
	                  }
	                };
	              }
	              for (var m = 0; m < group.appList.length; m++) {
	                var appId = group.appList[m];
	                nextPhases[appId] = {
	                  enabled: true,
	                  tabId: tabId,
	                  ruleId: i
	                };
	                enableOnlys[appId] = true;
	              }
	            } else {
	              nextPhases[appIds[k]] = {
	                enabled: true,
	                tabId: tabId,
	                ruleId: i
	              };
	              enableOnlys[appIds[k]] = true;
	            }
	          };

	          for (var k = 0; k < appIds.length; k++) {
	            var _ret2 = _loop2(k);

	            if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
	          }
	        } else {
	          var _loop3 = function _loop3(k) {
	            if (appIds[k].match(/^NooBoss-Group/)) {
	              var group = Management.groupList.filter(function (group) {
	                return group.id == appIds[k];
	              })[0];
	              if (!group) {
	                return {
	                  v: {
	                    v: void 0
	                  }
	                };
	              }
	              for (var m = 0; m < group.appList.length; m++) {
	                var appId = group.appList[m];
	                nextPhases[appId] = {
	                  enabled: enableOnlys[appId] || false,
	                  tabId: null,
	                  ruleId: i
	                };
	              }
	            } else {
	              nextPhases[appIds[k]] = {
	                enabled: enableOnlys[appIds[k]] || false,
	                tabId: null,
	                ruleId: i
	              };
	            }
	          };

	          for (var k = 0; k < appIds.length; k++) {
	            var _ret3 = _loop3(k);

	            if ((typeof _ret3 === "undefined" ? "undefined" : _typeof(_ret3)) === "object") return _ret3.v;
	          }
	        }
	        break;
	      case 'disableOnly':
	        if (matched) {
	          var _loop4 = function _loop4(k) {
	            if (appIds[k].match(/^NooBoss-Group/)) {
	              var group = Management.groupList.filter(function (group) {
	                return group.id == appIds[k];
	              })[0];
	              if (!group) {
	                return {
	                  v: {
	                    v: void 0
	                  }
	                };
	              }
	              for (var m = 0; m < group.appList.length; m++) {
	                var appId = group.appList[m];
	                nextPhases[appId] = {
	                  enabled: false,
	                  tabId: tabId,
	                  ruleId: i
	                };
	                disableOnlys[appId] = true;
	              }
	            } else {
	              nextPhases[appIds[k]] = {
	                enabled: false,
	                tabId: tabId,
	                ruleId: i
	              };
	              disableOnlys[appIds[k]] = true;
	            }
	          };

	          for (var k = 0; k < appIds.length; k++) {
	            var _ret4 = _loop4(k);

	            if ((typeof _ret4 === "undefined" ? "undefined" : _typeof(_ret4)) === "object") return _ret4.v;
	          }
	        } else {
	          var _loop5 = function _loop5(k) {
	            if (appIds[k].match(/^NooBoss-Group/)) {
	              var group = Management.groupList.filter(function (group) {
	                return group.id == appIds[k];
	              })[0];
	              if (!group) {
	                return {
	                  v: {
	                    v: void 0
	                  }
	                };
	              }
	              for (var m = 0; m < group.appList.length; m++) {
	                var appId = group.appList[m];
	                nextPhases[appId] = {
	                  enabled: !disableOnlys[appId] && true,
	                  tabId: null,
	                  ruleId: i
	                };
	              }
	            } else {
	              nextPhases[appIds[k]] = {
	                enabled: !disableOnlys[appIds[k]] && true,
	                tabId: null,
	                ruleId: i
	              };
	            }
	          };

	          for (var k = 0; k < appIds.length; k++) {
	            var _ret5 = _loop5(k);

	            if ((typeof _ret5 === "undefined" ? "undefined" : _typeof(_ret5)) === "object") return _ret5.v;
	          }
	        }
	        break;
	      case 'enableWhen':
	        if (matched) {
	          var _loop6 = function _loop6(k) {
	            if (appIds[k].match(/^NooBoss-Group/)) {
	              var group = Management.groupList.filter(function (group) {
	                return group.id == appIds[k];
	              })[0];
	              if (!group) {
	                return {
	                  v: {
	                    v: void 0
	                  }
	                };
	              }
	              for (var m = 0; m < group.appList.length; m++) {
	                var appId = group.appList[m];
	                nextPhases[appId] = {
	                  enabled: true,
	                  tabId: tabId,
	                  ruleId: i
	                };
	              }
	            } else {
	              nextPhases[appIds[k]] = {
	                enabled: true,
	                tabId: tabId,
	                ruleId: i
	              };
	            }
	          };

	          for (var k = 0; k < appIds.length; k++) {
	            var _ret6 = _loop6(k);

	            if ((typeof _ret6 === "undefined" ? "undefined" : _typeof(_ret6)) === "object") return _ret6.v;
	          }
	        }
	        break;
	      case 'disableWhen':
	        if (matched) {
	          var _loop7 = function _loop7(k) {
	            if (appIds[k].match(/^NooBoss-Group/)) {
	              var group = Management.groupList.filter(function (group) {
	                return group.id == appIds[k];
	              })[0];
	              if (!group) {
	                return {
	                  v: {
	                    v: void 0
	                  }
	                };
	              }
	              for (var m = 0; m < group.appList.length; m++) {
	                var appId = group.appList[m];
	                nextPhases[appId] = {
	                  enabled: false,
	                  tabId: null,
	                  ruleId: i
	                };
	              }
	            } else {
	              nextPhases[appIds[k]] = {
	                enabled: false,
	                tabId: null,
	                ruleId: i
	              };
	            }
	          };

	          for (var k = 0; k < appIds.length; k++) {
	            var _ret7 = _loop7(k);

	            if ((typeof _ret7 === "undefined" ? "undefined" : _typeof(_ret7)) === "object") return _ret7.v;
	          }
	        }
	        break;
	    }
	  };

	  for (var i = 0; i < autoState.rules.length; i++) {
	    var _ret = _loop(i);

	    if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
	  }
	  var ids = Object.keys(nextPhases);
	  for (var i = 0; i < ids.length; i++) {
	    var id = ids[i];
	    var phase = nextPhases[id];
	    autoState.setAppState(id, phase.enabled, phase.tabId, phase.ruleId);
	  }
	};

	Management.autoState.setAppState = function (id, enabled, tabId, ruleId) {
	  if (Management.apps[id]) {
	    var appInfo = Management.apps[id];
	    if (appInfo && appInfo.enabled != enabled) {
	      appInfo.enabled = enabled;
	      chrome.management.setEnabled(id, enabled, function () {
	        var enabledStr = 'enabled';
	        if (!enabled) {
	          enabledStr = 'disabled';
	        }
	        isOn('autoStateNotification', function () {
	          chrome.notifications.create({
	            type: 'basic',
	            iconUrl: '/images/icon_128.png',
	            title: GL('autoState'),
	            message: appInfo.name + GL('has_been') + GL(enabledStr) + GL('because_of_rule_') + (ruleId + 1),
	            requireInteraction: true
	          }, function (notificationId) {
	            get('notificationDuration_autoState', function (time) {
	              if (time > 0) {
	                setTimeout(function () {
	                  chrome.notifications.clear(notificationId, function () {});
	                }, time * 1000);
	              }
	            });
	          });
	        });
	        get('userId', function (userId) {
	          newCommunityRecord(false, { userId: userId, category: 'AutoState', event: enabledStr });
	        });
	        if (tabId) {
	          chrome.tabs.reload(tabId);
	        }
	      });
	    }
	  }
	};

	Management.updateGroupList = function () {
	  get('groupList', function (groupList) {
	    Management.groupList = groupList;
	  });
	};

	Management.autoState.init = function () {
	  Management.autoState.rules = [];
	  Management.autoState.tabs = {};
	  Management.updateGroupList();
	  chrome.tabs.query({}, function (tabList) {
	    for (var i = 0; i < tabList.length; i++) {
	      var tabInfo = tabList[i];
	      Management.autoState.tabs[tabInfo.id] = tabInfo.url;
	    }
	    Management.autoState.updateRules();
	  });
	};

	Management.autoState.updateRules = function () {
	  get('autoStateRules', function (data) {
	    if (data) {
	      Management.autoState.rules = JSON.parse(data);
	      Management.autoState.manage();
	    }
	  });
	};

	Management.updateAppInfo = function (appInfo, extraInfo, callback) {
	  this.Util.getIcon(appInfo, function (dataUrl) {
	    appInfo.icon = dataUrl;
	    getDB(appInfo.id, function (oldInfo) {
	      if (!oldInfo) {
	        oldInfo = {};
	        var time = new Date().getTime();
	        oldInfo.installedDate = time;
	        oldInfo.lastUpdateDate = time;
	      }
	      $.extend(oldInfo, appInfo, extraInfo);
	      setDB(appInfo.id, oldInfo, callback);
	    });
	  });
	};

	Management.updateAppInfoById = function (id, updateInfo) {
	  getDB(id, function (oldInfo) {
	    if (oldInfo) {
	      $.extend(oldInfo, updateInfo);
	      setDB(id, oldInfo);
	    }
	  });
	};

	Management.init = function () {
	  chrome.management.getAll(function (appInfoList) {
	    var apps = {};
	    for (var i = 0; i < appInfoList.length; i++) {
	      var appInfo = appInfoList[i];
	      NooBoss.Management.updateAppInfo(appInfo);
	      apps[appInfo.id] = appInfo;
	    }
	    Management.apps = apps;
	  });
	  isOn('autoState', Management.autoState.enable);
	};

	exports.default = Management;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var listeners = {};

	listeners.onEnabled = function (appInfoOld) {
	  var NooBoss = this;
	  var id = appInfoOld.id;
	  if (!NooBoss.Management.apps[id]) {
	    setTimeout(listeners.onEnabled.bind(null, appInfoOld), 900);
	    return;
	  }
	  this.Management.apps[id].enabled = true;
	  var recordEnable = function recordEnable(times, appInfo) {
	    if (!appInfo) {
	      if (times < 9) {
	        setTimeout(getDB.bind(null, id, recordEnable.bind(null, times + 1)), 1000);
	      }
	    } else {
	      NooBoss.History.addRecord({
	        event: 'enabled',
	        id: appInfo.id,
	        icon: appInfo.icon,
	        name: appInfo.name,
	        version: appInfo.version
	      });
	    }
	  };
	  getDB(id, recordEnable.bind(null, 1));
	  isOn('notifyStateChange', function () {
	    chrome.notifications.create({
	      type: 'basic',
	      iconUrl: '/images/icon_128.png',
	      title: capFirst(GL('enabled')) + ': ' + appInfoOld.name,
	      message: appInfoOld.name + GL('has_been') + GL('enabled'),
	      requireInteraction: true
	    }, function (notificationId) {
	      get('notificationDuration_stateChange', function (time) {
	        if (time > 0) {
	          setTimeout(function () {
	            chrome.notifications.clear(notificationId, function () {});
	          }, time * 1000);
	        }
	      });
	    });
	  });
	};

	exports.default = listeners;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var History = {};

	// get app info list from database
	History.init = function () {
	  getDB('history_records', function (recordList) {
	    this.History.recordList = recordList || [];
	  }.bind(this));
	};

	// add app info to both database and NooBoss.History.recordList(memory)
	History.addRecord = function (record) {
	  record.date = new Date().getTime();
	  this.History.recordList.push(record);
	  setDB('history_records', this.History.recordList);
	};

	// listen to install, remove, enable, and disable events
	History.listen = function () {
	  var NooBoss = this;

	  chrome.management.onInstalled.addListener(function (appInfo) {
	    NooBoss.Management.apps[appInfo.id] = {
	      enabled: appInfo.enabled,
	      name: appInfo.name
	    };
	    // display notification
	    getDB(appInfo.id, function (appInfoRecord) {
	      if (!appInfoRecord) {
	        appInfoRecord = {};
	      }
	      var time = new Date().getTime();
	      var event = 'installed';
	      var message = GL('ls_26');
	      // check if the app is updated to a new version or newly installed
	      if (!appInfoRecord.lastUpdateDate || !appInfoRecord.uninstalledDate || appInfoRecord.lastUpdateDate > appInfoRecord.uninstalledDate) {
	        if (appInfoRecord.version < appInfo.version) {
	          event = 'updated';
	          message = GL('ls_27');
	        }
	      }
	      if (event == 'installed') {
	        // check whether install event should be recorded or not
	        isOn('historyInstall', function () {
	          NooBoss.Management.updateAppInfo(appInfo, { lastUpdateDate: time }, function (data) {
	            getDB(appInfo.id, function (appInfo) {
	              NooBoss.History.addRecord({
	                event: event,
	                id: appInfo.id,
	                icon: appInfo.icon,
	                name: appInfo.name,
	                version: appInfo.version
	              });
	              isOn('notifyInstallation', function () {
	                chrome.notifications.create({
	                  type: 'basic',
	                  iconUrl: '/images/icon_128.png',
	                  title: appInfo.name + ' ' + GL(event),
	                  message: appInfo.name + ' ' + message,
	                  requireInteraction: true
	                }, function (notificationId) {
	                  // display notification for a certain peroid
	                  get('notificationDuration_installation', function (time) {
	                    if (time > 0) {
	                      setTimeout(function () {
	                        chrome.notifications.clear(notificationId, function () {});
	                      }, time * 1000);
	                    }
	                  });
	                });
	              });
	            });
	          });
	        });
	      } else {
	        NooBoss.Management.updateAppInfo(appInfo, { lastUpdateDate: time }, function (data) {
	          getDB(appInfo.id, function (appInfo) {
	            NooBoss.History.addRecord({
	              event: event,
	              id: appInfo.id,
	              icon: appInfo.icon,
	              name: appInfo.name,
	              version: appInfo.version
	            });
	            isOn('notifyInstallation', function () {
	              chrome.notifications.create({
	                type: 'basic',
	                iconUrl: '/images/icon_128.png',
	                title: appInfo.name + ' ' + GL(event),
	                message: appInfo.name + ' ' + message,
	                requireInteraction: true
	              }, function (notificationId) {
	                get('notificationDuration_installation', function (time) {
	                  if (time > 0) {
	                    setTimeout(function () {
	                      chrome.notifications.clear(notificationId, function () {});
	                    }, time * 1000);
	                  }
	                });
	              });
	            });
	          });
	        });
	      }
	    });
	  });

	  chrome.management.onUninstalled.addListener(function (id) {
	    isOn('historyRemove', function () {
	      NooBoss.Management.apps[id] = null;
	      var recordUninstall = function recordUninstall(times, appInfo) {
	        if (!appInfo) {
	          if (times < 9) {
	            setTimeout(getDB.bind(null, id, recordUninstall.bind(null, times + 1)), 1000);
	          }
	        } else {
	          NooBoss.History.addRecord({
	            event: 'removed',
	            id: appInfo.id,
	            icon: appInfo.icon,
	            name: appInfo.name,
	            version: appInfo.version
	          });
	        }
	      };
	      getDB(id, recordUninstall.bind(null, 1));
	      NooBoss.Management.updateAppInfoById(id, { uninstalledDate: new Date().getTime() });
	      isOn('notifyRemoval', function () {
	        getDB(id, function (appInfo) {
	          chrome.notifications.create({
	            type: 'basic',
	            iconUrl: '/images/icon_128.png',
	            title: appInfo.name + ' ' + capFirst(GL('removed')),
	            message: appInfo.name + ' ' + GL('ls_28'),
	            requireInteraction: true
	          }, function (notificationId) {
	            get('notificationDuration_removal', function (time) {
	              if (time > 0) {
	                setTimeout(function () {
	                  chrome.notifications.clear(notificationId, function () {});
	                }, time * 1000);
	              }
	            });
	          });
	        });
	      });
	    });
	  });

	  chrome.management.onEnabled.addListener(function (appInfo) {
	    isOn('historyEnable', NooBoss.listeners.onEnabled.bind(null, appInfo));
	  });

	  chrome.management.onDisabled.addListener(function (appInfoOld) {
	    isOn('historyDisable', function () {
	      var id = appInfoOld.id;
	      NooBoss.Management.apps[id].enabled = false;
	      var recordDisable = function recordDisable(times, appInfo) {
	        if (!appInfo) {
	          if (times < 9) {
	            setTimeout(getDB.bind(null, id, recordUninstall.bind(null, times + 1)), 1000);
	          }
	        } else {
	          NooBoss.History.addRecord({
	            event: 'disabled',
	            id: appInfo.id, icon: appInfo.icon,
	            name: appInfo.name,
	            version: appInfo.version
	          });
	        }
	      };
	      getDB(id, recordDisable.bind(null, 1));
	      isOn('notifyStateChange', function () {
	        chrome.notifications.create({
	          type: 'basic',
	          iconUrl: '/images/icon_128.png',
	          title: 'Disabled: ' + appInfoOld.name,
	          message: appInfoOld.name + GL('has_been') + GL('disabled'),
	          requireInteraction: true
	        }, function (notificationId) {
	          get('notificationDuration_stateChange', function (time) {
	            if (time > 0) {
	              setTimeout(function () {
	                chrome.notifications.clear(notificationId, function () {});
	              }, time * 1000);
	            }
	          });
	        });
	      });
	    });
	  });
	};

	exports.default = History;

/***/ })
/******/ ]);