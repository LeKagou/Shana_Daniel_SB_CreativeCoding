import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
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
    this.scene.background = new THREE.Color('#fbffb0');
    this.createMainLight();
<<<<<<< Updated upstream
    this.hdri = new RGBELoader().load("/studio_small_04_2k.hdr", (environnementMap) => {
=======
    this.hdri = new RGBELoader().load("\studio_small_04_2k.hdr", (environnementMap) => {
>>>>>>> Stashed changes
      environnementMap.mapping = THREE.EquirectangularReflectionMapping;
      // this.scene.background = environnementMap;
      this.scene.environment = environnementMap;
      this.scene.environmentIntensity = 0.18;
    });
    // this.createAmbientLight();
    this.createHemisphereLight();
    this.createFog();
  }

  /**
   * Crée et configure la lumière directionnelle principale
   */
  createMainLight() {
    this.mainLight = new THREE.DirectionalLight("#ffffff", 3);
    this.secondLight = new THREE.DirectionalLight("#ffffff", 2);
    this.mainLight.position.set(-15, 15, 7);
    this.secondLight.position.set(0, 10, 8);

    let helpLight = new THREE.DirectionalLightHelper(this.mainLight, 1);
    let helpLightSecond = new THREE.DirectionalLightHelper(this.secondLight, 1);

    this.scene.add(helpLight);
    this.scene.add(helpLightSecond);

    // Paramètres des ombres
    this.mainLight.castShadow = true;
    this.mainLight.shadow.mapSize.width = 2048;
    this.mainLight.shadow.mapSize.height = 2048;

    this.secondLight.castShadow = true;
    this.secondLight.shadow.mapSize.width = 2048;
    this.secondLight.shadow.mapSize.height = 2048;




    // Configuration de la caméra d'ombre
    const radiusMain = 16;
    this.mainLight.shadow.camera.near = 0.1;
    this.mainLight.shadow.camera.far = 50;
    this.mainLight.shadow.camera.left = -radiusMain;
    this.mainLight.shadow.camera.right = radiusMain;
    this.mainLight.shadow.camera.top = radiusMain;
    this.mainLight.shadow.camera.bottom = -radiusMain;
    this.mainLight.shadow.radius = radiusMain;
    this.mainLight.shadow.bias = - 0.0005;

    const radiusSecond = 10;
    this.secondLight.shadow.camera.near = 0.1;
    this.secondLight.shadow.camera.far = 50;
    this.secondLight.shadow.camera.left = -radiusSecond;
    this.secondLight.shadow.camera.right = radiusSecond;
    this.secondLight.shadow.camera.top = radiusSecond;
    this.secondLight.shadow.camera.bottom = -radiusSecond;
    this.secondLight.shadow.radius = radiusSecond;
    this.secondLight.shadow.bias = - 0.0005;

    this.mainLight.shadow.blurSamples = 32;
    this.secondLight.shadow.blurSamples = 16;


    this.scene.add(this.mainLight);
    this.scene.add(this.secondLight);

  }
  /**
 * Crée et configure la lumière d'hémisphère
 */
  createHemisphereLight() {
    // console.log(this.warmColor);
    this.groundColor = "#6ba6ff";
    this.HemisphereLight = new THREE.HemisphereLight("#ffffff", this.groundColor, 1);
    this.scene.add(this.HemisphereLight);
  }

  /**
   * Crée et configure la lumière ambiante
   */
  // createAmbientLight() {
  //   this.ambientLight = new THREE.AmbientLight("#ffffff", 0.4);
  //   this.scene.add(this.ambientLight);;
  // }
  createFog() {
    // const near = 4;
    // const far = 90;
    const density = 0.005;

    const fogColor = "rgb(220,220,220)";
    this.scene.fog = new THREE.FogExp2(fogColor, density);
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
