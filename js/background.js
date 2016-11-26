var NooBoss={};

NooBoss.defaultValues=[
  ['userId',(Math.random().toString(36)+'00000000000000000').slice(2, 19)],
  ['joinCommunity','1'],
  ['showAds','-1'],
];

NooBoss.resetSettings=function(){
  var temp;
  for(var i=0;i<NooBoss.defaultValues.length;i++){
    temp=NooBoss.defaultValues[i];
    set(temp[0],temp[1]);
  }
}

NooBoss.resetIndexedDB=function(){
  var req= window.indexedDB.deleteDatabase('NooBoss');
  req.onerror=function(e){
    console.log(e);
  }
  req.onsuccess=function(e){
    NooBoss.Management.init();
  }
}

NooBoss.initDefaultValues=function(){
  var temp;
  for(var i=0;i<NooBoss.defaultValues.length;i++){
    temp=NooBoss.defaultValues[i];
    setIfNull(temp[0],temp[1]);
  }
}

NooBoss.Util={};

NooBoss.Util.getIcon=function(appInfo,callback){
  var iconUrl=undefined;
  if(appInfo.icons){
    var maxSize=0;
    for(var j=0;j<appInfo.icons.length;j++){
      var iconInfo=appInfo.icons[j];
      if(iconInfo.size>maxSize){
        maxSize=iconInfo.size;
        iconUrl=iconInfo.url;
      }
    }
  }
  if(!iconUrl){
    var canvas=document.createElement("canvas");
    canvas.width=128;
    canvas.height=128;
    var ctx=canvas.getContext('2d');
    ctx.font="120px Arial";
    ctx.fillStyle="grey";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="white";
    ctx.fillText(appInfo.name[0],22,110);
    var dataUrl=canvas.toDataURL();
    callback(dataUrl);
  }
  else{
    dataUrlFromUrl(iconUrl,callback);
  }
}


//Management
NooBoss.Management={};
NooBoss.Management.updateAppInfo=function(appInfo,extraInfo,callback){
  NooBoss.Util.getIcon(appInfo,function(dataUrl){
    appInfo.icon=dataUrl;
    getDB(appInfo.id,function(oldInfo){
      if(!oldInfo){
        oldInfo={};
        var time=new Date().getTime();
        oldInfo.installedDate=time;
        oldInfo.lastUpdateDate=time;
      }
      $.extend(oldInfo,appInfo,extraInfo);
      setDB(appInfo.id,oldInfo,callback);
    });
  });
}

NooBoss.Management.updateAppInfoById=function(id,updateInfo){
  getDB(id,function(oldInfo){
    if(oldInfo){
      $.extend(oldInfo,updateInfo);
      setDB(id,oldInfo);
    }
  });
}

NooBoss.Management.init=function(){
  chrome.management.getAll(function(appInfoList){
    for(var i=0;i<appInfoList.length;i++){
      var appInfo=appInfoList[i];
      NooBoss.Management.updateAppInfo(appInfo);
    }
  });
}

//History
NooBoss.History={};
NooBoss.History.addRecord=function(record){
  getDB('history_records',function(recordList){
    if(!recordList){
      recordList=[];
    }
    record.date=new Date().getTime();
    recordList.push(record);
    setDB('history_records',recordList);
  });
}
NooBoss.History.listen=function(){
  chrome.management.onInstalled.addListener(function(appInfo){
    var time=new Date().getTime();
    NooBoss.Management.updateAppInfo(appInfo,{lastUpdateDate:time},function(data){
      getDB(appInfo.id,function(appInfo){
        NooBoss.History.addRecord({action:'installed', id:appInfo.id, icon: appInfo.icon, name:appInfo.name, version:appInfo.version});
      });
    });
    chrome.notifications.create({
      type:'basic',
      iconUrl: '/images/icon_128.png',
      title: 'Added: '+appInfo.type,
      message: appInfo.name+' has been added to your browswer'
    });
  });
  chrome.management.onUninstalled.addListener(function(id){
    getDB(id,function(appInfo){
      if(!appInfo){
        getDB(id,this);
      }
      else{
        NooBoss.History.addRecord({action:'removed', id:appInfo.id, icon: appInfo.icon, name:appInfo.name, version:appInfo.version});
      }
    });
    NooBoss.Management.updateAppInfoById(id,{uninstalledDate:new Date().getTime()});
    chrome.notifications.create({
      type:'basic',
      iconUrl: '/images/icon_128.png',
      title: 'Removed '+id,
      message: id+' has been removed from your browswer'
    });
  });
  chrome.management.onEnabled.addListener(function(appInfoOld){
    getDB(appInfoOld.id,function(appInfo){
      if(!appInfo){
        getDB(appInfoOld.id,this);
      }
      else{
        NooBoss.History.addRecord({action:'enabled', id:appInfo.id, icon: appInfo.icon, name:appInfo.name, version:appInfo.version});
      }
    });
    chrome.notifications.create({
      type:'basic',
      iconUrl: '/images/icon_128.png',
      title: 'Enabled: '+appInfoOld.name,
      message: appInfoOld.name+' is now enabled'
    });
  });
  chrome.management.onDisabled.addListener(function(appInfoOld){
    getDB(appInfoOld.id,function(appInfo){
      if(!appInfo){
        getDB(appInfoOld.id,this);
      }
      else{
        NooBoss.History.addRecord({action:'disabled', id:appInfo.id, icon: appInfo.icon, name:appInfo.name, version:appInfo.version});
      }
    });
    chrome.notifications.create({
      type:'basic',
      iconUrl: '/images/icon_128.png',
      title: 'Disabled: '+appInfoOld.name,
      message: appInfoOld.name+' is now disabled'
    });
  });
}


NooBoss.init=function(){
  NooBoss.initDefaultValues();
  NooBoss.History.listen();
  NooBoss.Management.init();
}

document.addEventListener('DOMContentLoaded', function(){
  NooBoss.init()
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if('job' in request){
        if (request.job == "reset"){
          NooBoss.resetSettings();
          NooBoss.resetIndexedDB();
        }
      }
    });
});
