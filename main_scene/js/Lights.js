import * as THREE from "three";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader.js";
/**
 * Classe gérant les lumières de la scène
 */

export default class Lights {
  /**
   * Initialise une nouvelle instance de Lights
   * @param {THREE.Scene} scene - La scène Three.js
   */
  constructor(scene) {
    this.scene = scene;
    this.setupLights();
    this.neutralColor = ["#FFFFFFFF"];
    this.warmColor = "#FFFFFFFF";
  }
  //VSMShadowMap
  /**
   * Configure toutes les lumières de la scène
   */
  setupLights() {
    //this.scene.background = new THREE.Color('rgb(222, 222, 222)');
    this.createMainLight();
    this.hdri = new RGBELoader().load("/studio_small_04_2k./hdr",(environnementMap) => {
      environnementMap.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.background = environnementMap;
      this.scene.environment = environnementMap;
    });
    this.createAmbientLight();
    this.createHemisphereLight();
    //this.createFog();
  }

  /**
   * Crée et configure la lumière directionnelle principale
   */
  createMainLight() {
    this.mainLight = new THREE.DirectionalLight("#ffffff", 3);
    this.mainLight.position.set(-10, 10, 5);

    let helpLight = new THREE.DirectionalLightHelper(this.mainLight, 1);
    this.scene.add(helpLight);

    // Paramètres des ombres
    this.mainLight.castShadow = true;
    this.mainLight.shadow.mapSize.width = 2048;
    this.mainLight.shadow.mapSize.height = 2048;

    // Configuration de la caméra d'ombre
    this.mainLight.shadow.camera.near = 0.1;
    this.mainLight.shadow.camera.far = 50;
    this.mainLight.shadow.camera.left = -17;
    this.mainLight.shadow.camera.right = 17;
    this.mainLight.shadow.camera.top = 17;
    this.mainLight.shadow.camera.bottom = -17;
    this.mainLight.shadow.radius = 10;
    this.mainLight.shadow.bias = - 0.0005;

    this.mainLight.shadow.blurSamples = 32;

    this.scene.add(this.mainLight);

  }
  /**
 * Crée et configure la lumière d'hémisphère
 */
  createHemisphereLight() {
    console.log(this.warmColor);
    this.groundColor = "#ffffff";
    this.HemisphereLight = new THREE.HemisphereLight(this.warmColor, this.groundColor, 1);
    this.scene.add(this.HemisphereLight);
  }

  /**
   * Crée et configure la lumière ambiante
   */
  createAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(this.neutralColor, 0.4);
    this.scene.add(this.ambientLight);;
  }
  createFog() {
    const near = 6;
    const far = 80;
    const fogColor = "rgb(0, 0, 90)";
    this.scene.fog = new THREE.Fog(fogColor, near, far);
  }

  /**
   * Met à jour la position de la lumière principale
   * @param {number} x - Position X
   * @param {number} y - Position Y
   * @param {number} z - Position Z
   */
  updateMainLightPosition(x, y, z) {
    this.mainLight.position.set(x, y, z);
  }

  /**
   * Met à jour la position de la lumière de remplissage
   * @param {number} x - Position X
   * @param {number} y - Position Y
   * @param {number} z - Position Z
   */

  /**
   * Nettoie les lumières de la scène
   */
  dispose() {
    this.scene.remove(this.mainLight);
    this.scene.remove(this.ambientLight);
    this.scene.remove(this.HemisphereLight);
  }
}
