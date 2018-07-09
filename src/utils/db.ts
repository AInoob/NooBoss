import browser from "./browser";

const indexedDB = window.indexedDB;

export const get = (key: string) => {
  return new Promise(resolve => {
    browser.storage.sync.get(key, (result: Object) => {
      resolve(result[key]);
    });
  });
};

export const set = (key: string, value: any) => {
  return new Promise(resolve => {
    // console.log(key,value);
    const temp: Object = {};
    temp[key] = value;
    browser.storage.sync.set(temp, resolve);
  })
};

export const bgSet = (key: string, value: any) => {
  browser.runtime.sendMessage({ job: 'set', key, value });
}

export const isOptionOn = async (key: string) => {
  const value = await get(key);
  if (value == '1' || value == true) {
    return true;
  } else {
    return false
  }
};

export const getDB = (key: string) => {
  return new Promise((resolve, reject) => {
    const indexedDB = window.indexedDB;
    const open = indexedDB.open("NooBox", 1);
    open.onupgradeneeded = () => {
      const db = open.result;
      const store = db.createObjectStore("Store", {
        keyPath: "key"
      });
    };
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction("Store", "readwrite");
      const store = tx.objectStore("Store");
      const action1 = store.get(key);
      action1.onsuccess = (e: any) => {
        if (e.target.result) {
          resolve(e.target.result.value);
        } else {
          resolve(null);
        }
      }
      action1.onerror = (e: Error) => {
        console.log('getDB fail');
        reject(e);
      }
    }
  });
};

export const setDB = (key: string, value: any) => {
  return new Promise(((resolve, reject) => {
    const indexedDB = window.indexedDB;
    const open = indexedDB.open("NooBox", 1);
    open.onupgradeneeded = () => {
      const db = open.result;
      const store = db.createObjectStore("Store", {
        keyPath: "key"
      });
    };
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction("Store", "readwrite");
      const store = tx.objectStore("Store");
      const action1 = store.put({
        key,
        value
      });
      action1.onsuccess = () => {
        resolve();
      }
      action1.onerror = (e: Error) => {
        console.log('setDB fail');
        reject(e);
      }
    }
  }));
}

export const deleteDB = (key: string) => {
  return new Promise(((resolve, reject) => {
    const open = indexedDB.open("NooBox", 1);
    open.onupgradeneeded = () => {
      const db = open.result;
      const store = db.createObjectStore("Store", {
        keyPath: "key"
      });
    };
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction("Store", "readwrite");
      const store = tx.objectStore("Store");
      const action1 = store.delete(key);
      action1.onsuccess = () => {
        resolve();
      }
      action1.onerror = (e: Error) => {
        console.log('deleteDB fail');
        reject(e);
      }
    }
  }));

};