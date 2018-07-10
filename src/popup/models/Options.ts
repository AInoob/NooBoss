import {observable} from "mobx";
import {defaultOptions, defaultOptionsDisplay} from "../../constants";
import DefaultOptionsDisplay from "../../interfaces/DefaultOptionsDisplay";
import DefaultOptions from "../../interfaces/DefaultOptions";

interface StringArray {
  [index: number]: string
}
let x: StringArray = ['a', 'b'];

class Options {
  @observable themeMainColor = { r: 0, g: 0, b: 0, a: 1 };
  @observable themeSubColor = { r: 0, g: 0, b: 0, a: 1 };
  @observable display: DefaultOptionsDisplay;

  @observable options: DefaultOptions;
  constructor() {
  }
  initialize() {
    this.options = defaultOptions;
  }
  initializeDisplay() {
    this.display = defaultOptionsDisplay;
  }
}

export default Options;