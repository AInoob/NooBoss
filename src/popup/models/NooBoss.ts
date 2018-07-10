import {observable} from "mobx";
import Options from "./Options";
import History from "./History";

class NooBoss {
  @observable themeMainColor = { r: 0, g: 0, b: 0, a: 1 };
  options: Options;
  history: History;
  constructor() {
    this.options = new Options();
    this.history = new History();
  }
}

export default NooBoss;