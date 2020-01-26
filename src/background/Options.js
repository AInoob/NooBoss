import {
  setIfNull,
  promisedGet,
  promisedSet,
  promisedSetIfNull,
  clearDB,
  notify,
  GL,
  sendMessage
} from '../utils';

export default (NooBoss) => {
  return {
    initiate: () => {
      return new Promise(async (resolve) => {
        NooBoss.Options.options = {};
        await NooBoss.Options.initiateDefaultValues();
        await NooBoss.Options.initiateConstantValues();
        resolve();
      });
    },
    initiateDefaultValues: () => {
      return new Promise(async (resolve) => {
        const keyList = Object.keys(NooBoss.defaultValues);
        for (let i = 0; i < keyList.length; i++) {
          const key = keyList[i];
          NooBoss.Options.options[key] = await promisedSetIfNull(
            key,
            NooBoss.defaultValues[key]
          );
          if (key == 'autoStateRules') {
            const value = await promisedGet(key);
            if (typeof value == 'string') {
              NooBoss.Options.options[key] = await promisedSet(
                key,
                JSON.parse(value)
              );
            }
          }
        }
        resolve();
      });
    },
    initiateConstantValues: () => {
      return new Promise(async (resolve) => {
        const keyList = Object.keys(NooBoss.constantValues);
        for (let i = 0; i < keyList.length; i++) {
          const key = keyList[i];
          NooBoss.Options.options[key] = await promisedSet(
            key,
            NooBoss.constantValues[key]
          );
        }
        resolve();
      });
    },
    promisedSet: (key, value) => {
      return new Promise(async (resolve) => {
        await promisedSet(key, value);
        NooBoss.Options.options[key] = value;
        resolve();
      });
    },
    resetOptions: () => {
      return new Promise(async (resolve) => {
        const keyList = Object.keys(NooBoss.defaultValues);
        for (let i = 0; i < keyList.length; i++) {
          const key = keyList[i];
          await promisedSet(key, NooBoss.defaultValues[key]);
        }
        resolve();
      });
    },
    resetIndexedDB: clearDB,
    importOptions: (optionsString) => {
      let options = null;
      if (!optionsString.match(/^NooBoss-Options/)) {
        notify(GL('backup'), GL('failed_to_import'), 5);
        return;
      }
      try {
        options = JSON.parse(optionsString.substr(16));
      } catch (e) {
        console.log(e);
        notify(GL('backup'), GL('failed_to_import'), 5);
        return;
      }
      if (!options) {
        notify(GL('backup'), GL('failed_to_import'), 5);
        return;
      }
      browser.storage.sync.set(options, async () => {
        sendMessage({ job: 'popupNooBossUpdateTheme' });
        sendMessage({ job: 'popupOptionsInitiate' });
        await NooBoss.Options.initiate();
        await NooBoss.Extensions.initiate();
        await NooBoss.AutoState.initiate();
        await NooBoss.History.initiate();
      });
      notify(GL('backup'), GL('successfully_imported'), 5);
    },
    exportOptions: () => {
      browser.storage.sync.get((data) => {
        const dataURI =
          'data:text;charset=utf-8,NooBoss-Options:' + JSON.stringify(data);
        const a = document.createElement('a');
        a.href = dataURI;
        a.download = 'NooBoss.options';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        notify(GL('backup'), GL('successfully_exported'), 5);
        a.remove();
      });
    },
    exportExtensions: () => {
      let appList = [];
      const appMap = NooBoss.Extensions.apps;
      Object.keys(appMap).forEach((id) => {
        const app = appMap[id];
        appList.push(app);
      });
      appList = appList.sort((a, b) => {
        if (a.enabled && !b.enabled) {
          return -1;
        } else if (!a.enabled && b.enabled) {
          return 1;
        }
        const nameA = a.name || '';
        const nameB = b.name || '';
        return nameA.localeCompare(nameB);
      });
      const dataURI =
        'data:text;charset=utf-8,' +
        `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Extensions - NooBoss</title>
          </head>
          <body> 
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${appList
                  .map((app) => {
                    const link =
                      app.installType === 'development'
                        ? `${app.name}`
                        : `<a href=${'https://chrome.google.com/webstore/detail/' +
                            app.id} target='_blank'>${app.name}</a>`;
                    return `<tr><td>${link}</td><td>${
                      app.enabled ? 'O' : 'X'
                    }</td></tr>`;
                  })
                  .join('')}
              </tbody>
            </table>
          </body>
        </html>
        `;
      const a = document.createElement('a');
      a.href = dataURI;
      a.download = 'Extensions.html';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      notify(GL('backup'), GL('successfully_exported_extensions'), 5);
      a.remove();
    }
  };
};
