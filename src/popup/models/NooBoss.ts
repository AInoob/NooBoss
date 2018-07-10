import {observable} from "mobx";
import Options from "./Options";
import History from "./History";
import UI from "./UI";

class NooBoss {
  @observable themeMainColor = { r: 0, g: 0, b: 0, a: 1 };
  options: Options;
  history: History;
  ui: UI;
  constructor() {
    this.options = new Options();
    this.history = new History();
    this.ui = new UI();
  }
}

export default NooBoss;