import MainScene from "./MainScene.js";

export default class App {
  constructor() {
    console.log("App constructor");
    this.init();
  }

  init() {
    this.mainScene = new MainScene();
  }
}
