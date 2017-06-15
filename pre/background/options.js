function resetSettings() {
  let temp;
  for(var i = 1; i < NooBoss.defaultValues.length; i++){
    temp = this.defaultValues[i];
    set(temp[0],temp[1]);
  }
}

function resetIndexedDB(callback) {
  let req = window.indexedDB.deleteDatabase('NooBoss');
  req.onerror = function(e){
    console.log(e);
  }
  if(callback) {
    req.onsuccess = callback;
  }
}

function initDefaultValues() {
  let temp;
  for(let i = 0; i < this.defaultValues.length; i++){
    temp = this.defaultValues[i];
    setIfNull(temp[0],temp[1]);
  }
}

export { resetSettings, resetIndexedDB, initDefaultValues };
