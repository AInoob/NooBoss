const History = {};

// get app info list from database
History.init = function() {
  getDB('history_records', function(recordList){
    this.History.recordList = recordList||[];
  }.bind(this));
}

// add app info to both database and NooBoss.History.recordList(memory)
History.addRecord = function(record){
  record.date=new Date().getTime();
  this.History.recordList.push(record);
  setDB('history_records', this.History.recordList);
}

// listen to install, remove, enable, and disable events
History.listen = function() {
  const NooBoss = this;

  chrome.management.onInstalled.addListener((appInfo) => {
    NooBoss.Management.apps[appInfo.id] = {
      enabled: appInfo.enabled,
      name: appInfo.name
    };
    // display notification
    getDB(appInfo.id, (appInfoRecord) => {
      if(!appInfoRecord){
        appInfoRecord = {};
      }
      const time = new Date().getTime();
      let event = 'installed';
      let message = GL('ls_26');
      // check if the app is updated to a new version or newly installed
      if((!appInfoRecord.lastUpdateDate) || (!appInfoRecord.uninstalledDate) || appInfoRecord.lastUpdateDate>appInfoRecord.uninstalledDate){
        if(appInfoRecord.version < appInfo.version){
          event = 'updated';
          message = GL('ls_27');
        }
      }
      if(event == 'installed') {
        // check whether install event should be recorded or not
        isOn('historyInstall', () => {
          NooBoss.Management.updateAppInfo(appInfo,{lastUpdateDate:time}, (data) => {
            getDB(appInfo.id, (appInfo) => {
              NooBoss.History.addRecord({
                event,
                id: appInfo.id,
                icon: appInfo.icon,
                name: appInfo.name,
                version: appInfo.version
              });
              isOn('notifyInstallation', () => {
                chrome.notifications.create({
                  type: 'basic',
                  iconUrl: '/images/icon_128.png',
                  title: appInfo.name+' '+GL(event),
                  message: appInfo.name+' '+message,
                  requireInteraction: true
                }, (notificationId) => {
                  // display notification for a certain peroid
                  get('notificationDuration_installation', (time) => {
                    if(time>0){
                      setTimeout(() => {
                        chrome.notifications.clear(notificationId, () => {});
                      },time*1000);
                    }
                  });
                });
              });
            });
          });
        });
      }
      else {
        NooBoss.Management.updateAppInfo(appInfo,{ lastUpdateDate:time }, (data) => {
          getDB(appInfo.id, (appInfo) => {
            NooBoss.History.addRecord({
              event,
              id: appInfo.id,
              icon: appInfo.icon,
              name: appInfo.name,
              version: appInfo.version
            });
            isOn('notifyInstallation', () => {
              chrome.notifications.create({
                type:'basic',
                iconUrl: '/images/icon_128.png',
                title: appInfo.name+' '+GL(event),
                message: appInfo.name+' '+message,
                requireInteraction: true
              }, (notificationId) => {
                get('notificationDuration_installation', (time) => {
                  if(time>0){
                    setTimeout(() => {
                      chrome.notifications.clear(notificationId, () => {});
                    },time*1000);
                  }
                });
              });
            });
          });
        });
      }
    });
  });

  chrome.management.onUninstalled.addListener((id) => {
    isOn('historyRemove', () => {
      NooBoss.Management.apps[id] = null;
      var recordUninstall = (times,appInfo) => {
        if(!appInfo){
          if(times<9){
            setTimeout(getDB.bind(null,id,recordUninstall.bind(null,times+1)),1000);
          }
        }
        else{
          NooBoss.History.addRecord({
            event:'removed',
            id:appInfo.id,
            icon: appInfo.icon,
            name:appInfo.name,
            version:appInfo.version
          });
        }
      }
      getDB(id,recordUninstall.bind(null,1));
      NooBoss.Management.updateAppInfoById(id,{uninstalledDate:new Date().getTime()});
      isOn('notifyRemoval', () => {
        getDB(id, (appInfo) => {
          chrome.notifications.create({
            type:'basic',
            iconUrl: '/images/icon_128.png',
            title: appInfo.name+' '+capFirst(GL('removed')),
            message: appInfo.name+' '+GL('ls_28'),
            requireInteraction: true
          }, (notificationId) => {
              get('notificationDuration_removal', (time) => {
                if(time>0){
                  setTimeout(() => {
                    chrome.notifications.clear(notificationId, () => {});
                  },time*1000);
                }
              });
            });
        });
      });
    });
  });

  chrome.management.onEnabled.addListener((appInfo) => {
    isOn('historyEnable', NooBoss.listeners.onEnabled.bind(null, appInfo));
  });

  chrome.management.onDisabled.addListener((appInfoOld) => {
    isOn('historyDisable', () => {
      var id=appInfoOld.id;
      NooBoss.Management.apps[id].enabled = false;
      var recordDisable = (times,appInfo) => {
        if(!appInfo){
          if(times<9){
            setTimeout(getDB.bind(null,id,recordUninstall.bind(null,times+1)),1000);
          }
        }
        else{
          NooBoss.History.addRecord({
            event:'disabled',
            id:appInfo.id, icon:
            appInfo.icon,
            name:appInfo.name,
            version:appInfo.version
          });
        }
      }
      getDB(id,recordDisable.bind(null,1));
      isOn('notifyStateChange', () => {
        chrome.notifications.create({
          type:'basic',
          iconUrl: '/images/icon_128.png',
          title: 'Disabled: '+appInfoOld.name,
          message: appInfoOld.name+GL('has_been')+GL('disabled'),
          requireInteraction: true
        }, (notificationId) => {
            get('notificationDuration_stateChange', (time) => {
              if(time>0){
                setTimeout(() => {
                  chrome.notifications.clear(notificationId,function(){});
                },time*1000);
              }
            });
          });
      });
    });
  });
}

export { History as default };
