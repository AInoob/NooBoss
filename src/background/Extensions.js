import {
  waitFor,
  promisedGet,
  getIconDBKey,
  promisedSetDB,
  promisedGetDB,
  sendMessage,
  promisedSet
} from '../utils';

export default (NooBoss) => {
  return {
    initiate: () => {
      return new Promise(async (resolve) => {
        NooBoss.Extensions.apps = {};
        NooBoss.Extensions.tempActiveList = [];
        NooBoss.Extensions.groupList = await promisedGet('groupList');
        await NooBoss.Extensions.getAllApps();
        resolve();
      });
    },
    addTempActive(id) {
      const tempActiveList = NooBoss.Extensions.tempActiveList;
      if (tempActiveList.indexOf(id) === -1) {
        tempActiveList.push(id);
        setTimeout(() => {
          const index = tempActiveList.indexOf(id);
          tempActiveList.splice(index, 1);
        }, 2333);
      }
    },
    getAllApps: () => {
      return new Promise((resolve) => {
        browser.management.getAll(async (appInfoList) => {
          for (let i = 0; i < appInfoList.length; i++) {
            const appInfo = appInfoList[i];
            await NooBoss.Extensions.updateAppInfo(appInfo);
          }
          resolve();
        });
      });
    },
    getIdsFromGroupsAndIds: (groupsAndIds) => {
      const appIds = {};
      for (let i = 0; i < groupsAndIds.length; i++) {
        const name = groupsAndIds[i];
        let appId;
        if (name.match(/^NooBoss-Group/)) {
          const group = NooBoss.Extensions.groupList.filter((group) => {
            return group.id === name;
          })[0];
          if (!group) {
            continue;
          }
          for (let j = 0; j < group.appList.length; j++) {
            appId = group.appList[j];
            appIds[appId] = true;
          }
        } else {
          appId = name;
          appIds[appId] = true;
        }
      }
      return Object.keys(appIds);
    },
    updateAppInfo: (appInfo, extraInfo) => {
      return new Promise(async (resolve) => {
        appInfo.icon = await getIconDBKey(appInfo);
        const oldInfo = (await promisedGetDB(appInfo.id)) || {};
        const time = new Date().getTime();
        const preset = {};
        const postset = {};
        postset.lastUpdateDate = time;
        postset.installedDate = time;
        const newInfo = {
          ...preset,
          ...oldInfo,
          ...appInfo,
          ...extraInfo,
          ...postset
        };
        NooBoss.Extensions.apps[newInfo.id] = newInfo;
        await promisedSetDB(appInfo.id, newInfo);
        resolve();
      });
    },
    updateAppInfoById: (id, updateInfo) => {
      return new Promise(async (resolve) => {
        if (!id) {
          resolve();
          return;
        }
        if (!updateInfo.enabled || updateInfo.uninstalledDate) {
          NooBoss.Extensions.addTempActive(id);
        }
        const oldInfo = await promisedGetDB(id);
        if (!oldInfo) {
          resolve();
        }
        const newInfo = { ...oldInfo, ...updateInfo };
        NooBoss.Extensions.apps[newInfo.id] = newInfo;
        await promisedSetDB(id, newInfo);
        resolve();
      });
    },
    delete: async (id) => {
      await waitFor(233);
      delete NooBoss.Extensions.apps[id];
    },
    toggle: (id, enabled) => {
      return new Promise((resolve) => {
        if (enabled === undefined) {
          enabled = !NooBoss.Extensions.apps[id].enabled;
        }
        if (
          id === 'aajodjghehmlpahhboidcpfjcncmcklf' ||
          id === 'nkkbbadgjkchmggnpbammldmkbnhndme'
        ) {
          enabled = true;
        }
        browser.management.setEnabled(id, enabled, () => {
          NooBoss.Extensions.apps[id].enabled = enabled;
          sendMessage({ job: 'extensionToggled', id, enabled });
          resolve();
        });
      });
    },
    groupToggle: (id, enabled) => {
      const group = NooBoss.Extensions.groupList.filter((elem) => {
        return elem.id === id;
      })[0];
      group.appList.map((elem) => {
        NooBoss.Extensions.toggle(elem, enabled);
      });
    },
    groupCopy: async (id) => {
      const group = NooBoss.Extensions.groupList.filter((elem) => {
        return elem.id === id;
      })[0];
      const newGroup = JSON.parse(JSON.stringify(group));
      newGroup.id =
        'NooBoss-Group-' +
        Math.random()
          .toString(36)
          .slice(2, 19) +
        Math.random()
          .toString(36)
          .slice(2, 19);
      NooBoss.Extensions.groupList.push(newGroup);
      sendMessage({ job: 'groupCopied', newGroup });
      await promisedSet('groupList', NooBoss.Extensions.groupList);
    },
    groupRemove: (id) => {
      return new Promise((resolve) => {
        NooBoss.Extensions.groupList.map(async (elem, index) => {
          if (elem.id === id) {
            NooBoss.Extensions.groupList.splice(index, 1);
            sendMessage({ job: 'groupRemoved', index });
            await promisedSet('groupList', NooBoss.Extensions.groupList);
            resolve();
          }
        });
      });
    },
    groupListUpdate: (groupList) => {
      return new Promise(async (resolve) => {
        NooBoss.Extensions.groupList = groupList;
        sendMessage({ job: 'groupListUpdated', groupList });
        await promisedSet('groupList', NooBoss.Extensions.groupList);
        resolve();
      });
    },
    newGroup: () => {
      return new Promise(async (resolve) => {
        NooBoss.Extensions.groupList.push({
          appList: [],
          id:
            'NooBoss-Group-' +
            Math.random()
              .toString(36)
              .slice(2, 19) +
            Math.random()
              .toString(36)
              .slice(2, 19),
          name: 'Group x'
        });
        sendMessage({
          job: 'groupListUpdated',
          groupList: NooBoss.Extensions.groupList
        });
        await promisedSet('groupList', NooBoss.Extensions.groupList);
        resolve();
      });
    },
    groupUpdate: (group) => {
      return new Promise(async (resolve) => {
        for (let i = 0; i < NooBoss.Extensions.groupList.length; i++) {
          if (NooBoss.Extensions.groupList[i].id === group.id) {
            NooBoss.Extensions.groupList[i] = group;
            sendMessage({ job: 'groupUpdated', group });
            await promisedSet('groupList', NooBoss.Extensions.groupList);
            resolve();
            break;
          }
        }
      });
    },
    options: (id) => {
      const url = NooBoss.Extensions.apps[id].optionsUrl;
      browser.tabs.create({ url });
    },
    remove: (id) => {
      browser.management.uninstall(id, { showConfirmDialog: true }, () => {
        browser.management.get(id, (result) => {
          if (browser.runtime.lastError || !result) {
            NooBoss.Extensions.delete(id);
            sendMessage({ job: 'extensionRemoved', id });
          }
        });
      });
    },
    browserOptions: (id) => {
      browser.tabs.create({ url: 'chrome://extensions/?id=' + id });
    },
    launchApp: (id) => {
      chrome.management.launchApp(id);
    },
    openManifest: (id) => {
      const url = 'chrome-extension://' + id + '/manifest.json';
      browser.tabs.create({ url });
    },
    openWebStore: (id) => {
      const url = 'https://chrome.google.com/webstore/detail/' + id;
      browser.tabs.create({ url });
    }
  };
};
