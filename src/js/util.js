var shared={};

var timeagoInstance=null;

if(chrome.i18n.getUILanguage()=='zh-CN'){
  timeago.register('locale', function(number, index) {
    return [
	['刚刚', '片刻后'],
    ['%s秒前', '%s秒后'],
    ['1分钟前', '1分钟后'],
    ['%s分钟前', '%s分钟后'],
    ['1小时前', '1小时后'],
    ['%s小时前', '%s小时后'],
    ['1天前', '1天后'],
    ['%s天前', '%s天后'],
    ['1周前', '1周后'],
    ['%s周前', '%s周后'],
    ['1月前', '1月后'],
    ['%s月前', '%s月后'],
    ['1年前', '1年后'],
    ['%s年前', '%s年后']
    ][index];
  });
}
timeagoInstance=new timeago();

function compare(a,b){
  var cursor=0;
  var lenA=a.length;
  var lenB=b.length;
  var aa=a.toLowerCase();
  var bb=b.toLowerCase();
  var tempA,tempB;
  while(lenA>cursor&&lenB>cursor){
    tempA=aa.charCodeAt(cursor);
    tempB=bb.charCodeAt(cursor);
    if(tempA==tempB){
      cursor++;
      continue;
    }
    else{
      return tempA-tempB;
    }
  }
  return lenA-lenB;
}

function getLocale(string){
  return chrome.i18n.getMessage(string);
}

var GL=getLocale;

//Community wrapper
function CW(callback,category,action,label,e){
  newCommunityRecord(true,['_trackEvent', category, action,label]);
  callback(e);
}

//Click link rich
function CLR(url,category,action,label,e){
  e.preventDefault();
  newCommunityRecord(true,['_trackEvent', category, action,label]);
  setTimeout(function(){
    chrome.tabs.create({url:url});
  },100);
}

function CL(url,category,action,e){
  e.preventDefault();
  newCommunityRecord(true,['_trackEvent', category, action,url]);
  setTimeout(function(){
    chrome.tabs.create({url:url});
  },100);
}

function getChromeVersion(){
  var match = window.navigator.userAgent.match(/Chrom(?:e|ium)\/([0-9\.]+)/);
  return match ? match[1] : null;
}

function extractDomain(url) {
  if(!url){
    return 'error';
  }
  var domain;
  if (url.indexOf("://") > -1) {
    domain = url.split('/')[2];
  }
  else {
    domain = url.split('/')[0];
  }
  domain = domain.split(':')[0];
  var list=domain.split('.');
  return list[list.length-2]+'.'+list[list.length-1];
}

function capFirst(elem){
  str=getString(elem);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getString(elem){
  if(elem===undefined||elem===null){
    return '';
  }
  else{
    return elem.toString();
  }
}

function newCommunityRecord(ga,data){
  isOn('sendUsage',function(){
    if(ga){
      _gaq.push(data);
    }
    else{
      $.ajax({
        type:'POST',
        contentType: "application/json",
        data: JSON.stringify(data),
        url:'https://ainoob.com/api/nooboss/hi'
      });
    }
  });
}

function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getA(url){
  var parser = document.createElement('a');
  parser.href = url;
  return parser;
}


function dataUrlFromUrl(link, callback){
  var img=new Image();
  img.addEventListener('load',function(){
    var canvas=document.createElement("canvas");
    canvas.width=img.width;
    canvas.height=img.height;
    var ctx=canvas.getContext('2d');
    ctx.drawImage(img,0,0,img.width,img.height);
    var dataUrl=canvas.toDataURL();
    callback(dataUrl);
  });
  img.src=link;
}

function isOn(key,callbackTrue,callbackFalse,param){
  get(key,function(value){
    if(value=='1'||value==true){
      if(callbackTrue){
        callbackTrue(param);
      }
    }
    else{
      if(callbackFalse){
        callbackFalse(param);
      }
    }
  });
}

function setIfNull(key,setValue,callback){
  get(key,function(value){
    if(value==undefined||value==null){
      set(key,setValue,callback);
    }
    else{
      if(callback){
        callback();
      }
    }
  });
}

function setDB(key,value,callback){
  var indexedDB = window.indexedDB;
  var open = indexedDB.open("NooBoss", 1);
  open.onupgradeneeded = function() {
    var db = open.result;
    var store = db.createObjectStore("Store", {keyPath: "key"});
  };
  open.onsuccess = function() {
    var db = open.result;
    var tx = db.transaction("Store", "readwrite");
    var store = tx.objectStore("Store");
    var action1=store.put({key:key, value:value});
    action1.onsuccess=function(){
      if(callback){
        callback();
      }
    }
    action1.onerror=function(){
      console.log('setDB fail');
    }
  }
}

function getDB(key,callback){
  if(callback){
    var indexedDB = window.indexedDB;
    var open = indexedDB.open("NooBoss", 1);
    open.onupgradeneeded = function() {
      var db = open.result;
      var store = db.createObjectStore("Store", {keyPath: "key"});
    };
    open.onsuccess = function() {
      var db = open.result;
      var tx = db.transaction("Store", "readwrite");
      var store = tx.objectStore("Store");
      var action1=store.get(key);
      action1.onsuccess=function(e){
        if(e.target.result){
          callback(e.target.result.value);
        }
        else{
          callback(null);
        }
      }
      action1.onerror=function(){
        console.log('getDB fail');
      }
    }
  }
}

function set(key,value,callback){
  var temp={};
  temp[key]=value;
  chrome.storage.sync.set(temp,callback);
}

function get(key,callback){
  chrome.storage.sync.get(key,function(result){
    if(callback)
    callback(result[key]);
  });
}
