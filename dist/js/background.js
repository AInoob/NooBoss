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
/***/ function(module, exports, __webpack_require__) {

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
	      }
	    }
	  });
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var defaultValues = [['userId', (Math.random().toString(36) + '00000000000000000').slice(2, 19)], ['showAds', false], ['notifyStateChange', true], ['notifyInstallation', true], ['notifyRemoval', true], ['historyInstall', true], ['historyRemove', true], ['historyUpdate', true], ['historyEnable', true], ['historyDisable', true], ['autoState', true], ['autoStateNotification', true], ['autoStateRules', '[]'], ['sortOrder', 'nameState'], ['recoExtensions', true], ['defaultPage', 'manage'], ['notificationDuration_autoState', 5], ['notificationDuration_stateChange', 5], ['notificationDuration_installation', -1], ['notificationDuration_removal', -1], ['listView', true], ['sendUsage', true]];

	exports.defaultValues = defaultValues;

/***/ },
/* 2 */
/***/ function(module, exports) {

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

/***/ },
/* 3 */
/***/ function(module, exports) {

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

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
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

	Management.autoState.manage = function (tabId) {
	  var autoState = Management.autoState;
	  var tabs = autoState.tabs;
	  var nextPhases = {};
	  var enableOnlys = {};
	  var disableOnlys = {};
	  for (var i = 0; i < autoState.rules.length; i++) {
	    var rule = autoState.rules[i];
	    var appIds = rule.ids;
	    var pattern = new RegExp(rule.match.url, 'i');
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
	          for (var k = 0; k < appIds.length; k++) {
	            nextPhases[appIds[k]] = {
	              enabled: true,
	              tabId: tabId,
	              ruleId: i
	            };
	            enableOnlys[appIds[k]] = true;
	          }
	        } else {
	          for (var _k = 0; _k < appIds.length; _k++) {
	            nextPhases[appIds[_k]] = {
	              enabled: enableOnlys[appIds[_k]] || false,
	              tabId: null,
	              ruleId: i
	            };
	          }
	        }
	        break;
	      case 'disableOnly':
	        if (matched) {
	          for (var _k2 = 0; _k2 < appIds.length; _k2++) {
	            nextPhases[appIds[_k2]] = {
	              enabled: false,
	              tabId: tabId,
	              ruleId: i
	            };
	            disableOnlys[appIds[_k2]] = true;
	          }
	        } else {
	          for (var _k3 = 0; _k3 < appIds.length; _k3++) {
	            nextPhases[appIds[_k3]] = {
	              enabled: !disableOnlys[appIds[_k3]] && true,
	              tabId: null,
	              ruleId: i
	            };
	          }
	        }
	        break;
	      case 'enableWhen':
	        if (matched) {
	          for (var _k4 = 0; _k4 < appIds.length; _k4++) {
	            nextPhases[appIds[_k4]] = {
	              enabled: true,
	              tabId: tabId,
	              ruleId: i
	            };
	          }
	        }
	        break;
	      case 'disableWhen':
	        if (matched) {
	          for (var _k5 = 0; _k5 < appIds.length; _k5++) {
	            nextPhases[appIds[_k5]] = {
	              enabled: false,
	              tabId: null,
	              ruleId: i
	            };
	          }
	        }
	        break;
	    }
	  }
	  var ids = Object.keys(nextPhases);
	  for (var _i = 0; _i < ids.length; _i++) {
	    var id = ids[_i];
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

	Management.autoState.init = function () {
	  Management.autoState.rules = [];
	  Management.autoState.tabs = {};
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

/***/ },
/* 5 */
/***/ function(module, exports) {

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

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var History = {};
	History.init = function () {
	  getDB('history_records', function (recordList) {
	    this.History.recordList = recordList || [];
	  }.bind(this));
	};
	History.addRecord = function (record) {
	  record.date = new Date().getTime();
	  this.History.recordList.push(record);
	  setDB('history_records', this.History.recordList);
	};
	History.listen = function () {
	  var NooBoss = this;
	  chrome.management.onInstalled.addListener(function (appInfo) {
	    NooBoss.Management.apps[appInfo.id] = {
	      enabled: appInfo.enabled,
	      name: appInfo.name
	    };
	    getDB(appInfo.id, function (appInfoRecord) {
	      if (!appInfoRecord) {
	        appInfoRecord = {};
	      }
	      var time = new Date().getTime();
	      var event = 'installed';
	      var message = GL('ls_26');
	      if (!appInfoRecord.lastUpdateDate || !appInfoRecord.uninstalledDate || appInfoRecord.lastUpdateDate > appInfoRecord.uninstalledDate) {
	        if (appInfoRecord.version < appInfo.version) {
	          event = 'updated';
	          message = GL('ls_27');
	        }
	      }
	      if (event == 'installed') {
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

/***/ }
/******/ ]);