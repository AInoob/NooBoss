function getChromeVersion(){
  var match = window.navigator.userAgent.match(/Chrom(?:e|ium)\/([0-9\.]+)/);
  return match ? match[1] : null;
}

var textIdMap={
  joinCommunity: 'join NooBoss community',
  showAds: 'show ADs',
  notifyStateChange: 'notify state change',
  notifyInstallation: 'notify installation',
  notifyRemoval: 'notify removal',
  autoStateManage: 'auto state manage'
}

function getTextFromId(id){
  return textIdMap[id];
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
  isOn('joinCommunity',function(){
    if(ga){
      _gaq.push(data);
    }
    else{
      console.log(data);
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
    if(value=='1'){
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
    if(!value){
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
