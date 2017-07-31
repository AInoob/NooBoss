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

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var getDB = exports.getDB = function getDB(key, callback) {
	if (callback) {
		var indexedDB = window.indexedDB;
		var open = indexedDB.open('NooBoss', 1);
		open.onupgradeneeded = function () {
			var db = open.result;
			var store = db.createObjectStore('Store', { keyPath: 'key' });
		};
		open.onsuccess = function () {
			var db = open.result;
			var tx = db.transaction('Store', 'readwrite');
			var store = tx.objectStore('Store');
			var action = store.get(key);
			action.onsuccess = function (e) {
				if (e.target.result) {
					callback(e.target.result.value);
				} else {
					callback(null);
				}
			};
			action.onerror = function () {
				console.log('getDB fail');
			};
		};
	}
};

var setDB = exports.setDB = function setDB(key, value, callback) {
	var indexedDB = window.indexedDB;
	var open = indexedDB.open('NooBoss', 1);
	open.onupgradeneeded = function () {
		var db = open.result;
		var store = db.createObjectStore('Store', { keyPath: 'key' });
	};
	open.onsuccess = function () {
		var db = open.result;
		var tx = db.transaction('Store', 'readwrite');
		var store = tx.objectStore('Store');
		var action = store.put({ key: key, value: value });
		action.onsuccess = function () {
			if (callback) {
				callback();
			}
		};
		action.onerror = function () {
			console.log('setDB fail');
		};
	};
};

var getParameterByName = exports.getParameterByName = function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
	var results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
};

var getString = exports.getString = function getString(elem) {
	if (elem === undefined || elem === null) {
		return '';
	} else {
		return elem.toString();
	}
};

var capFirst = exports.capFirst = function capFirst(elem) {
	var str = getString(elem);
	return str.charAt(0).toUpperCase() + str.slice(1);
};

var GL = exports.GL = function GL(string) {
	return chrome.i18n.getMessage(string);
};

var get = exports.get = function get(key, callback) {
	chrome.storage.sync.get(key, function (result) {
		if (callback) callback(result[key]);
	});
};

var isOn = exports.isOn = function isOn(key, callbackTrue, callbackFalse, param) {
	get(key, function (value) {
		if (value == '1' || value == true) {
			if (callbackTrue) {
				callbackTrue(param);
			}
		} else {
			if (callbackFalse) {
				callbackFalse(param);
			}
		}
	});
};

var set = exports.set = function set(key, value, callback) {
	var temp = {};
	temp[key] = value;
	chrome.storage.sync.set(temp, callback);
};

var setAsync = exports.setAsync = function setAsync(key, value) {
	return new Promise(function (resolve) {
		var temp = {};
		temp[key] = value;
		chrome.storage.sync.set(temp, function () {
			resolve();
		});
	});
};

var setIfNull = exports.setIfNull = function setIfNull(key, setValue, callback) {
	get(key, function (value) {
		if (value == undefined || value == null) {
			set(key, setValue, callback);
		} else {
			if (callback) {
				callback();
			}
		}
	});
};

var generateRGBAString = exports.generateRGBAString = function generateRGBAString(rgbaObject) {
	return 'rgba(' + rgbaObject.r + ',' + rgbaObject.g + ',' + rgbaObject.b + ',' + rgbaObject.a + ')';
};

var sendMessage = exports.sendMessage = function sendMessage(message) {
	var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

	chrome.runtime.sendMessage(message, callback);
};

var notify = exports.notify = function notify(title, message, duration) {
	chrome.notifications.create({
		type: 'basic',
		iconUrl: '/images/icon_128.png',
		title: title,
		message: message,
		requireInteraction: true
	}, function (notificationId) {
		if (duration > 0) {
			setTimeout(function () {
				chrome.notifications.clear(notificationId, function () {});
			}, duration * 1000);
		}
	});
};

var alerty = exports.alerty = function alerty(text, mainColor, callbackConfirm, callbackCancel) {
	var alertHolder = document.createElement('div');
	var alertDiv = document.createElement('div');
	var texty = document.createElement('div');
	texty.innerHTML = text;
	var confirmy = document.createElement('button');
	confirmy.innerHTML = GL('confirm');
	confirmy.onclick = function () {
		if (callbackConfirm) {
			callbackConfirm();
		}
		document.body.removeChild(alertHolder);
	};
	var cancely = document.createElement('button');
	cancely.innerHTML = GL('cancel');
	cancely.onclick = function () {
		if (callbackCancel) {
			callbackCancel();
		}
		document.body.removeChild(alertHolder);
	};

	alertHolder.style.position = 'fixed';
	alertHolder.style.width = '100%';
	alertHolder.style.height = '100%';
	alertHolder.style.top = '0';
	alertHolder.style.background = 'rgba(0,0,0,0.4)';

	alertDiv.style.width = '300px';
	alertDiv.style.padding = '13px';
	alertDiv.style.marginLeft = '250px';
	alertDiv.style.marginTop = '100px';
	alertDiv.style.textAlign = 'center';
	alertDiv.style.backgroundColor = 'white';

	texty.style.fontSize = 'large';
	texty.style.marginBottom = '13px';

	confirmy.style.border = 'none';
	confirmy.style.color = 'white';
	confirmy.style.padding = '2px 8px';
	confirmy.style.cursor = 'pointer';
	confirmy.style.outline = 'none';
	confirmy.style.backgroundColor = mainColor;

	cancely.style.border = 'none';
	cancely.style.color = 'white';
	cancely.style.padding = '2px 8px';
	cancely.style.cursor = 'pointer';
	cancely.style.outline = 'none';
	cancely.style.backgroundColor = mainColor;
	cancely.style.marginLeft = '30px';

	alertDiv.appendChild(texty);
	alertDiv.appendChild(confirmy);
	alertDiv.appendChild(cancely);
	alertHolder.appendChild(alertDiv);
	document.body.appendChild(alertHolder);
};

/***/ }),

/***/ 286:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(287);

/***/ }),

/***/ 287:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (typeof global === "undefined" ? "undefined" : _typeof(global)) === "object" ? global : (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" ? window : (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" ? self : undefined;

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime && Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(288);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch (e) {
    g.regeneratorRuntime = undefined;
  }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(35)))

/***/ }),

/***/ 288:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!function (global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = ( false ? "undefined" : _typeof(module)) === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      prototype[method] = function (arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  runtime.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function (arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (_typeof(global.process) === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
      // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
      // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function (object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function stop() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
}(
// Among the various tricks for obtaining a reference to the global
// object, this seems to be the most reliable technique that does not
// use indirect eval (which violates Content Security Policy).
(typeof global === "undefined" ? "undefined" : _typeof(global)) === "object" ? global : (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" ? window : (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" ? self : undefined);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(35), __webpack_require__(36)(module)))

/***/ }),

/***/ 35:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),

/***/ 36:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),

/***/ 459:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regenerator = __webpack_require__(286);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _values = __webpack_require__(460);

var _Options = __webpack_require__(461);

var _Options2 = _interopRequireDefault(_Options);

var _Bello = __webpack_require__(462);

var _Bello2 = _interopRequireDefault(_Bello);

var _utils = __webpack_require__(20);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var NooBoss = {
	defaultValues: _values.defaultValues,
	constantValues: _values.constantValues
};
window.NooBoss = NooBoss;

NooBoss.initiate = function () {
	NooBoss.Options = (0, _Options2.default)(NooBoss);
	NooBoss.Options.initiate();
	NooBoss.Bello = (0, _Bello2.default)(NooBoss);
	chrome.runtime.onMessage.addListener(function () {
		var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee(message, sender, sendResponse) {
			return _regenerator2.default.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							_context.t0 = message.job;
							_context.next = _context.t0 === 'bello' ? 3 : _context.t0 === 'set' ? 5 : _context.t0 === 'reset' ? 8 : _context.t0 === 'clearHistory' ? 19 : _context.t0 === 'toggleAutoState' ? 22 : _context.t0 === 'updateAutoStateRules' ? 24 : _context.t0 === 'updateGroupList' ? 26 : 28;
							break;

						case 3:
							NooBoss.Bello.bello(message.bananana);
							return _context.abrupt('break', 28);

						case 5:
							(0, _utils.set)(message.key, message.value);
							(0, _utils.isOn)('bello', NooBoss.Bello.bello.bind(null, { category: 'Options', action: 'set', label: message.key }));
							return _context.abrupt('break', 28);

						case 8:
							_context.next = 10;
							return NooBoss.Options.resetOptions();

						case 10:
							_context.next = 12;
							return NooBoss.Options.resetIndexedDB();

						case 12:
							_context.next = 14;
							return NooBoss.Extensions.initiate();

						case 14:
							_context.next = 16;
							return NooBoss.History.initiate();

						case 16:
							(0, _utils.notify)((0, _utils.GL)('extension_name'), (0, _utils.GL)('successfully_reset_everything'), 3);
							(0, _utils.isOn)('bello', NooBoss.Bello.bello.bind(null, { category: 'Options', action: 'reset', label: '' }));
							return _context.abrupt('break', 28);

						case 19:
							(0, _utils.notify)((0, _utils.GL)('extension_name'), (0, _utils.GL)('successfully_cleared_history'), 3);
							(0, _utils.isOn)('bello', NooBoss.Bello.bello.bind(null, { category: 'Options', action: 'clearHistory', label: '' }));
							return _context.abrupt('break', 28);

						case 22:
							(0, _utils.isOn)('bello', NooBoss.Bello.bello.bind(null, { category: 'Options', action: 'set', label: 'autoState' }));
							return _context.abrupt('break', 28);

						case 24:
							(0, _utils.isOn)('bello', NooBoss.Bello.bello.bind(null, { category: 'AutoState', action: 'updateAutoStateRules', label: '' }));
							return _context.abrupt('break', 28);

						case 26:
							(0, _utils.isOn)('bello', NooBoss.Bello.bello.bind(null, { category: 'Extensions', action: 'updateGroupList', label: '' }));
							return _context.abrupt('break', 28);

						case 28:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, undefined);
		}));

		return function (_x, _x2, _x3) {
			return _ref.apply(this, arguments);
		};
	}());
};

document.addEventListener('DOMContentLoaded', NooBoss.initiate);

/***/ }),

/***/ 460:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var defaultValues = exports.defaultValues = {
	userId: (Math.random().toString(36) + '00000000000000000').slice(2, 19),
	notifyStateChange: true,
	notifyInstallation: true,
	notifyRemoval: true,
	historyInstall: true,
	historyRemoval: true,
	historyUpdate: true,
	historyEnable: true,
	historyDisable: true,
	autoState: true,
	autoStateNotification: true,
	autoStateRules: [],
	sortOrder: 'nameState',
	bello: true,
	joinCommunity: true,
	notificationDuration_autoState: 5,
	notificationDuration_stateChange: 5,
	notificationDuration_installation: -1,
	notificationDuration_removal: -1,
	listView: true,
	sendUsage: true,
	groupList: [],
	mainColor: { r: 185, g: 7, b: 168, a: 1 },
	subColor: { r: 0, g: 0, b: 0, a: 1 },
	extensions: true,
	userscripts: true,
	extensionsJoinCommunity: true,
	userscriptsJoinCommunity: true
};

var constantValues = exports.constantValues = {
	version: '0.1.5.0'
};

/***/ }),

/***/ 461:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = __webpack_require__(286);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _utils = __webpack_require__(20);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function (NooBoss) {
	return {
		initiate: function initiate() {
			NooBoss.Options.initiateDefaultValues();
			NooBoss.Options.initiateConstantValues();
		},
		initiateDefaultValues: function initiateDefaultValues() {
			var keyList = Object.keys(NooBoss.defaultValues);

			var _loop = function _loop(i) {
				var key = keyList[i];
				(0, _utils.setIfNull)(key, NooBoss.defaultValues[key], function () {
					// if is autoState, change it from string to array
					if (key == 'autoStateRules') {
						(0, _utils.get)(key, function (value) {
							if (typeof value == 'string') {
								(0, _utils.set)(key, JSON.parse(value));
							}
						});
					}
				});
			};

			for (var i = 0; i < keyList.length; i++) {
				_loop(i);
			}
		},
		initiateConstantValues: function initiateConstantValues() {
			var keyList = Object.keys(NooBoss.constantValues);
			for (var i = 0; i < keyList.length; i++) {
				var _key = keyList[i];
				(0, _utils.set)(_key, NooBoss.constantValues[_key]);
			}
		},
		resetOptions: function resetOptions() {
			return new Promise(function () {
				var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee(resolve) {
					var keyList, i, _key2;

					return _regenerator2.default.wrap(function _callee$(_context) {
						while (1) {
							switch (_context.prev = _context.next) {
								case 0:
									keyList = Object.keys(NooBoss.defaultValues);
									i = 0;

								case 2:
									if (!(i < keyList.length)) {
										_context.next = 9;
										break;
									}

									_key2 = keyList[i];
									_context.next = 6;
									return (0, _utils.setAsync)(_key2, NooBoss.defaultValues[_key2]);

								case 6:
									i++;
									_context.next = 2;
									break;

								case 9:
									resolve();

								case 10:
								case 'end':
									return _context.stop();
							}
						}
					}, _callee, undefined);
				}));

				return function (_x) {
					return _ref.apply(this, arguments);
				};
			}());
		},
		resetIndexedDB: function resetIndexedDB() {
			return new Promise(function (resolve) {
				var req = window.indexedDB.deleteDatabase('NooBoss');
				req.onerror = function (e) {
					console.log(e);
					resolve();
				};
				req.onsuccess = function () {
					resolve();
				};
			});
		}
	};
};

/***/ }),

/***/ 462:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (NooBoss) {
	return {
		belloOnce: false,
		history: {},
		bananana: {
			path: NooBoss.constantValues.version,
			title: 'NooBoss ' + NooBoss.constantValues.version,
			referrer: '',
			ua: navigator.userAgent,
			sr: screen.width + 'x' + screen.height,
			ul: navigator.language || navigator.userLanguage
		},
		bello: function bello(obj) {
			var id = '' + obj.category + '_' + obj.action + '_' + obj.label;
			if (NooBoss.Bello.history[id] && NooBoss.Bello.history[id] + 10000 > new Date().getTime()) {
				NooBoss.Bello.history[id] = new Date().getTime();
				return;
			}
			NooBoss.Bello.history[id] = new Date().getTime();
			var data = JSON.parse(JSON.stringify(NooBoss.Bello.bananana));
			if (!NooBoss.Bello.belloOnce) {
				NooBoss.Bello.belloOnce = true;
				data = _extends({}, data, {
					type: 'pageview',
					ainoob: Math.random()
				});
				NooBoss.Bello.ajax('https://ainoob.com/bello/nooboss' + NooBoss.Bello.serialize(data));
			}
			data = JSON.parse(JSON.stringify(NooBoss.Bello.bananana));
			data = _extends({}, data, {
				type: 'event',
				category: obj.category,
				action: obj.action,
				label: obj.label,
				value: obj.value || 0,
				ainoob: Math.random()
			});
			NooBoss.Bello.ajax('https://ainoob.com/bello/nooboss' + NooBoss.Bello.serialize(data));
		},
		ajax: function ajax(url) {
			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.onload = function () {
				if (request.status >= 200 && request.status < 400) {
					console.log(request.responseText);
				}
			};
			request.send();
		},
		serialize: function serialize(obj) {
			return '?' + Object.keys(obj).reduce(function (a, k) {
				a.push(k + '=' + encodeURIComponent(obj[k]));return a;
			}, []).join('&');
		}
	};
};

/***/ })

/******/ });