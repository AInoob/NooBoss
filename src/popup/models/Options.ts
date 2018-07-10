import {observable} from "mobx";
import {defaultOptions, defaultOptionsDisplay} from "../../constants";
import DefaultOptions from "../../interfaces/DefaultOptions";
import {get} from "../../utils/db";

interface StringArray {
  [index: number]: string
}
let x: StringArray = ['a', 'b'];

class Options {
  @observable themeMainColor = { r: 0, g: 0, b: 0, a: 1 };
  @observable themeSubColor = { r: 0, g: 0, b: 0, a: 1 };

  @observable options: DefaultOptions;
  constructor() {
  }
  async initialize() {
    this.options = defaultOptions;
    for (let key in this.options) {
      const value = await get(key);
      this.options[key] = value;
    }
  }
}

export default Options;