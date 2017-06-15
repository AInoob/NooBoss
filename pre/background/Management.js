const Management = {};

Management.autoState = {};

Management.autoState.enable = () => {
  Management.autoState.init();
  chrome.tabs.onCreated.addListener((tab) => {
    Management.autoState.newTab(tab);
  });
  chrome.tabs.onUpdated.addListener((tabId,info,tab) => {
    Management.autoState.updateTab(tabId,info,tab);
  });
  chrome.tabs.onRemoved.addListener((tabId) => {
    Management.autoState.removeTab(tabId);
  });
  chrome.tabs.onReplaced.addListener((addedTabId,removedTabId) => {
    Management.autoState.tabs[removedTabId] = null;
    chrome.tabs.get(addedTabId, (tab) => {
      Management.autoState.newTab(tab);
    });
  });
}

Management.autoState.newTab = (tab) => {
  Management.autoState.tabs[tab.id] = tab.url;
  Management.autoState.manage(tab.id);
}

Management.autoState.updateTab = (tabId,changeInfo,tab) => {
  if(changeInfo.url){
    const oldUrl = (Management.autoState.tabs[tabId] || {}).url;
    if(oldUrl != changeInfo.url) {
      Management.autoState.tabs[tabId] = changeInfo.url;
      Management.autoState.manage(tabId);
    }
  }
}

Management.autoState.removeTab = (tabId) => {
  Management.autoState.tabs[tabId] = null;
  Management.autoState.manage(tabId);
}

Management.autoState.disable = () => {
  chrome.tabs.onCreated.removeListener();
  chrome.tabs.onUpdated.removeListener();
  chrome.tabs.onRemoved.removeListener();
  chrome.tabs.onReplaced.removeListener();
}

Management.autoState.manage = (tabId) => {
  const autoState = Management.autoState;
  const tabs = autoState.tabs;
  const nextPhases = {};
  const enableOnlys = {};
  const disableOnlys={};
  for(let i = 0; i < autoState.rules.length; i++){
    const rule=autoState.rules[i];
    const appIds=rule.ids;
    const pattern=new RegExp(rule.match.url,'i');
    const tabIds=Object.keys(tabs);
    let matched=false;
    for(let j=0;j<tabIds.length;j++){
      const url=tabs[tabIds[j]];
      if(pattern.exec(url)){
        matched=true;
        break;
      }
    }
    switch(rule.action){
      case 'enableOnly':
        if(matched){
          for(let k=0;k<appIds.length;k++){
            nextPhases[appIds[k]]={
              enabled: true,
              tabId: tabId,
              ruleId: i
            }
            enableOnlys[appIds[k]]=true;
          }
        }
        else{
          for(let k=0;k<appIds.length;k++){
            nextPhases[appIds[k]]={
              enabled: enableOnlys[appIds[k]]||false,
              tabId: null,
              ruleId: i
            }
          }
        }
        break;
      case 'disableOnly':
        if(matched){
          for(let k=0;k<appIds.length;k++){
            nextPhases[appIds[k]]={
              enabled: false,
              tabId: tabId,
              ruleId: i
            }
            disableOnlys[appIds[k]]=true;
          }
        }
        else{
          for(let k=0;k<appIds.length;k++){
            nextPhases[appIds[k]]={
              enabled: (!disableOnlys[appIds[k]])&&true,
              tabId: null,
              ruleId: i
            }
          }
        }
        break;
      case 'enableWhen':
        if(matched){
          for(let k=0;k<appIds.length;k++){
            nextPhases[appIds[k]]={
              enabled: true,
              tabId: tabId,
              ruleId: i
            }
          }
        }
        break;
      case 'disableWhen':
        if(matched){
          for(let k=0;k<appIds.length;k++){
            nextPhases[appIds[k]]={
              enabled: false,
              tabId: null,
              ruleId: i
            }
          }
        }
        break;
    }
  }
  const ids=Object.keys(nextPhases);
  for(let i=0;i<ids.length;i++){
    const id=ids[i];
    const phase=nextPhases[id];
    autoState.setAppState(id,phase.enabled,phase.tabId,phase.ruleId);
  }
}

Management.autoState.setAppState = (id,enabled,tabId,ruleId) => {
  if(Management.apps[id]){
    const appInfo = Management.apps[id];
    if(appInfo && appInfo.enabled != enabled){
      appInfo.enabled = enabled;
      chrome.management.setEnabled(id, enabled, () => {
        let enabledStr='enabled';
        if(!enabled){
          enabledStr='disabled';
        }
        isOn('autoStateNotification', () => {
          chrome.notifications.create({
            type:'basic',
            iconUrl: '/images/icon_128.png',
            title: GL('autoState'),
            message: appInfo.name+GL('has_been')+GL(enabledStr)+GL('because_of_rule_')+(ruleId+1),
            requireInteraction: true
          }, (notificationId) => {
            get('notificationDuration_autoState', (time) => {
              if(time>0){
                setTimeout(() => {
                  chrome.notifications.clear(notificationId,() => {});
                },time*1000);
              }
            });
          });
        });
        get('userId', (userId) => {
          newCommunityRecord(false,{userId:userId,category:'AutoState',event:enabledStr});
        });
        if(tabId){
          chrome.tabs.reload(tabId);
        }
      });
    }
  }
}

Management.autoState.init = () => {
  Management.autoState.rules=[];
  Management.autoState.tabs={};
  chrome.tabs.query({}, (tabList) => {
    for(let i=0;i<tabList.length;i++){
      const tabInfo=tabList[i];
      Management.autoState.tabs[tabInfo.id]=tabInfo.url;
    }
    Management.autoState.updateRules();
  });
}

Management.autoState.updateRules = () => {
  get('autoStateRules', (data) => {
    if(data){
      Management.autoState.rules = JSON.parse(data);
      Management.autoState.manage();
    }
  });
}

Management.updateAppInfo = function(appInfo,extraInfo,callback) {
  this.Util.getIcon(appInfo, (dataUrl) => {
    appInfo.icon = dataUrl;
    getDB(appInfo.id, (oldInfo) => {
      if(!oldInfo) {
        oldInfo = {};
        var time = new Date().getTime();
        oldInfo.installedDate = time;
        oldInfo.lastUpdateDate = time;
      }
      $.extend(oldInfo,appInfo,extraInfo);
      setDB(appInfo.id,oldInfo,callback);
    });
  });
}

Management.updateAppInfoById = (id,updateInfo) => {
  getDB(id, (oldInfo) => {
    if(oldInfo){
      $.extend(oldInfo,updateInfo);
      setDB(id,oldInfo);
    }
  });
}

Management.init = () => {
  chrome.management.getAll((appInfoList) => {
    const apps={};
    for(let i=0;i<appInfoList.length;i++){
      const appInfo=appInfoList[i];
      NooBoss.Management.updateAppInfo(appInfo);
      apps[appInfo.id]=appInfo;
    }
    Management.apps=apps;
  });
  isOn('autoState', Management.autoState.enable);
}

export { Management as default };
