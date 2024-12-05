import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Lights from "./Lights.js";
import Interaction from "./Interaction.js";
import ButtonCube from "./shapes/ButtonCube.js";
import FirebaseConfig from "./FirebaseConfig.js";
import FirebaseListener from "./FirebaseListener.js";
import { loadModels } from "./loader";
import { modelDescriptors } from "./modelDescriptors";
import Piece from "./Objects/Piece.js";
import {MaterialsManager} from "./MaterialsManager.js";
import { cos } from "three/webgpu";


let finalOffset = 2;
let finalPoses = [-3, -2.5, -2.3, -1.95, -1.75, -1.3];

export default class MainScene {
  //? Initialise la scène avec les paramètres par défaut
  constructor() {
    this.meshes = [];
    this.mixers = [];
    this.buttons = [];
    this.pieces = {};
    this.arrayModels = modelDescriptors;
    this.arrayMaterials = MaterialsManager;
    loadModels(this.arrayModels).then((models) => {
      this.models = models;
      this.init();
    });

    this.OBJFini = false;
  }

  async init() {
    await this.loadConfig();
    this.initializeBasicSettings();
    this.setupRenderer();
    this.setupCamera();
    this.setupControls();
    this.setupLights();
    this.setupEventListeners();
    this.createModels();
    this.createPhysicalButtons();
    this.setupInteraction();
    this.render();
    this.firebaseListener = new FirebaseListener(this.pieces);
  }

  createModels() {
    for (let i = 0; i < this.models.length; i++) {
      //console.log(this.models[i].id);
      let obj = this.models[i].object;

      const pos = this.models[i].props.position;
      const scale = this.models[i].props.scale;
      const rot = this.models[i].props.rotation;

      obj.position.set(pos.x, pos.y, pos.z);
      obj.scale.set(scale.x, scale.y, scale.z);
      obj.rotation.set(rot.x, rot.y, rot.z);

      obj.traverse((child) => {
        if (child.isMesh) {
          console.log(child.name);
          let checkIn = false;
          for(let i = 0; i < this.arrayMaterials.length; i++){
              if(child.name  == this.arrayMaterials[i].objName){
                for (let j = 0; j < this.arrayMaterials[i].matProperties.length; j++) {
                  if(child.material[j] == undefined){
                    child.material = new THREE.MeshPhysicalMaterial({
                      color: this.arrayMaterials[i].matProperties[j].color, 
                      roughness: this.arrayMaterials[i].matProperties[j].roughness, 
                      metalness: this.arrayMaterials[i].matProperties[j].metalness,
                      flatShading: this.arrayMaterials[i].matProperties[j].flatShading,
                      sheen: this.arrayMaterials[i].matProperties[j].sheen,
                      sheenColor: this.arrayMaterials[i].matProperties[j].sheenColor,
                    });
                    checkIn = true;
                  }else if(child.material.length > 1){
                    child.material[j] = new THREE.MeshPhysicalMaterial({
                      color: this.arrayMaterials[i].matProperties[j].color, 
                      roughness: this.arrayMaterials[i].matProperties[j].roughness, 
                      metalness: this.arrayMaterials[i].matProperties[j].metalness,
                      flatShading: this.arrayMaterials[i].matProperties[j].flatShading,
                      sheen: this.arrayMaterials[i].matProperties[j].sheen,
                      sheenColor: this.arrayMaterials[i].matProperties[j].sheenColor,
                    });
                    checkIn = true;
                  }
                }
              }
          };

          if(checkIn == false){
            for (let j = 0; j < this.arrayMaterials[0].matProperties.length; j++) {
              let previousColor = child.material.color;
              console.log(previousColor);
              if(child.material[j] == undefined){
                child.material = new THREE.MeshPhysicalMaterial({
                  color: "rgb[255,255,255]",
                  roughness: this.arrayMaterials[0].matProperties[j].roughness, 
                  metalness: this.arrayMaterials[0].matProperties[j].metalness,
                  flatShading: this.arrayMaterials[0].matProperties[j].flatShading,
                  sheen: this.arrayMaterials[0].matProperties[j].sheen,
                  sheenColor: this.arrayMaterials[0].matProperties[j].sheenColor,
                });
                checkIn = true;
              }else if(child.material.length > 1){
                child.material[j] = new THREE.MeshPhysicalMaterial({
                  color: "rgb[255,255,255]",
                  roughness: this.arrayMaterials[0].matProperties[j].roughness, 
                  metalness: this.arrayMaterials[0].matProperties[j].metalness,
                  flatShading: this.arrayMaterials[0].matProperties[j].flatShading,
                  sheen: this.arrayMaterials[0].matProperties[j].sheen,
                  sheenColor: this.arrayMaterials[0].matProperties[j].sheenColor,
                });
                checkIn = true;
              }
            }
          }

          //child.material = material;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.scene.add(obj);
      this.meshes.push(obj);

      this.createPieces(this.models, i);
    }
  }

  //? Créer chaque piece
  createPieces(models, i) {
    if (models[i].animated == true) {
      let piece = new Piece(models[i].object, i);
      piece.uid = models[i].id;
      console.log(models[i].piecePlace);
      piece.index = models[i].piecePlace;
      this.pieces[piece.uid] = piece;
      this.pieces[piece.uid].LoadAndCreateAnimation();
      piece.definePositions(
        this.models[i].offset,
        finalPoses[models[i].piecePlace] + finalOffset
      );
    }
  }

  //? Prendre les informatons de material de l'objet
  getMaterialInfo(model) {
    let material = new THREE.MeshPhysicalMaterial({
      color: model.OBJmaterial.color, // Couleur bleue
      roughness: model.OBJmaterial.roughness, // Surface mate
      metalness: model.OBJmaterial.metalness, // Pas d'aspect métallique
      flatShading: model.OBJmaterial.flatShading,
    });

    return material;
  }

  //? Créer les boutons physiques
  createPhysicalButtons() {
    this.numButtons = 6;
    // liste des couleurs
    for (let i = 0; i < this.otherUIDs.length; i++) {
      const e = new ButtonCube(this.scene, i, this.otherUIDs);
      this.buttons.push(e);
    }
  }

  //? Initialise les paramètres de base de la scène
  initializeBasicSettings() {
    this.scene = new THREE.Scene();
  }

  //? Configure le rendu WebGL
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.VSMShadowMap;
    this.renderer.toneMapping = THREE.NeutralToneMapping,
    this.renderer.toneMappingExposure = 0.8;
    //this.renderer.setClearColor("#f0e6e6");
    document.body.appendChild(this.renderer.domElement);
  }

  //? Configure la caméra orthographique
  setupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const viewSize = 7;
    this.camera = new THREE.OrthographicCamera(
      -viewSize * aspect,
      viewSize * aspect,
      viewSize,
      -viewSize,
      -50,
      100
    );
    this.camera.position.set(14, 15, 15);
    this.camera.lookAt(0, 0, 0);
  }

  //? Configure les contrôles de la caméra
  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 50;
  }

  //? Configure l'éclairage de la scène
  setupLights() {
    this.lights = new Lights(this.scene);
  }

  //? Configure les écouteurs d'événements
  setupEventListeners() {
    this.onResize = this.onResize.bind(this);
    this.render = this.render.bind(this);
    window.addEventListener("resize", this.onResize);
  }

  //?Configure l'interaction avec les boutons
  setupInteraction() {
    this.interaction = new Interaction(this.camera, this.scene, this.buttons);
  }

  //? Boucle de mise à jour pour l'animation
  update() {
    if (this.controls) {
      this.controls.update();
    }

    if (this.interaction) {
      this.interaction.update();
    }

    this.buttons.forEach((button) => {
      button.update();
    });
  }

  //? Boucle de rendu
  render() {
    requestAnimationFrame(this.render);
    const test = Object.values(this.pieces);
    // console.log(test);
    let boolsTrue = [];
    for (let i = 0; i < Object.values(this.pieces).length; i++) {
      Object.values(this.pieces)[i].animate();
      boolsTrue.push(Object.values(this.pieces)[i].finished);
    }

    if (boolsTrue.some((val) => val === false)) {
      this.OBJFini = false;
    }

    if (boolsTrue.every((val) => val === true)) {
      if (this.OBJFini == false) {
        Object.values(this.pieces).forEach((p) => {
          p.goFinal();
        });
        this.OBJFini = true;
      }
    }


    this.update();
    this.renderer.render(this.scene, this.camera);
  }

  //? Gère le redimensionnement de la fenêtre
  onResize() {
    const aspect = window.innerWidth / window.innerHeight;
    const viewSize = 10;

    this.camera.left = -viewSize * aspect;
    this.camera.right = viewSize * aspect;
    this.camera.top = viewSize;
    this.camera.bottom = -viewSize;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  //? Nettoie les ressources
  cleanup() {
    if (this.guiControls) this.guiControls.destroy();
    if (this.lights) this.lights.dispose();
    if (this.floor) this.floor.removeFromScene(this.scene);
    if (this.interaction) this.interaction.dispose();
    window.removeEventListener("resize", this.onResize);
  }

  //? Charge la configuration depuis le fichier JSON
  loadConfig() {
    return new Promise(async (resolve) => {
      try {
        const response = await fetch("json/Config.json");
        const config = await response.json();

        const urlParams = new URLSearchParams(window.location.search);
        const uid = urlParams.get("uid");

        FirebaseConfig.UID = uid || config.UID;
        FirebaseConfig.NAME = config.NAME;
        FirebaseConfig.reset();

        this.otherUIDs = config.OTHERS.map((other) => ({
          name: other.name,
          uid: other.uid,
          title: other.title,
        }));
      } catch (error) {
        console.error("Erreur lors du chargement de la configuration:", error);
      }
      resolve();
    });
  }
}
