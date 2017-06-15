const listeners={};

listeners.onEnabled = function(appInfoOld) {
  const NooBoss = this;
  var id=appInfoOld.id;
  if(!NooBoss.Management.apps[id]){
    setTimeout(listeners.onEnabled.bind(null,appInfoOld),900);
    return;
  }
  this.Management.apps[id].enabled = true;
  const recordEnable = (times,appInfo) => {
    if(!appInfo){
      if(times<9){
        setTimeout(getDB.bind(null,id,recordEnable.bind(null,times+1)),1000);
      }
    }
    else{
      NooBoss.History.addRecord({
        event: 'enabled',
        id: appInfo.id,
        icon: appInfo.icon,
        name: appInfo.name,
        version: appInfo.version
      });
    }
  }
  getDB(id,recordEnable.bind(null,1));
  isOn('notifyStateChange', () => {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/images/icon_128.png',
      title: capFirst(GL('enabled'))+': '+appInfoOld.name,
      message: appInfoOld.name+GL('has_been')+GL('enabled'),
      requireInteraction: true
    }, (notificationId) => {
        get('notificationDuration_stateChange', (time) => {
          if(time>0){
            setTimeout(() => {
              chrome.notifications.clear(notificationId, () => {});
            },time*1000);
          }
        });
      });
  });
}

export { listeners as default };
