import {observable} from "mobx";
import {defaultOptionsDisplay} from "../../constants";
import DefaultOptionsDisplay from "../../interfaces/DefaultOptionsDisplay";
import {get, getDB} from "../../utils/db";

interface StringArray {
  [index: number]: string
}
let x: StringArray = ['a', 'b'];

class UI {
  @observable options: DefaultOptionsDisplay;
  constructor() {
  }
  async initialize() {
    for (let key in this.options) {
      const value = await get(key);
      this.options[key] = value;
    }
  }
  async initializeOptions() {
    this.options = defaultOptionsDisplay;
    this.options = await getDB('ui_options');
  }
}

export default UI;