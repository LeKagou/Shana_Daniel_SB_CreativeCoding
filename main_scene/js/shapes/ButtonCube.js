import FirebaseConfig from "../FirebaseConfig.js";
import * as THREE from "three";

export default class ButtonCube {
  constructor(scene, id, buttonsData = null, meshToInteract) {
    this.clickable = true;
    this.meshToInteract = meshToInteract;
    // this.addDebugLabel();
    this.scene = scene;
    this.buttonSize = 0.5;
    this.buttonDepth = 1;
    this.index = id;
    this.uid = buttonsData[id].uid;
    //!- Gestion de l'animation
    this.setupAnimationState();
    this.createMesh();
    this.setupPosition();
  }

  createMesh() {
    this.geometry = new THREE.CylinderGeometry(
      this.buttonSize, // width
      this.buttonSize, // height - now fixed to buttonSize
      this.buttonDepth // depth
    );
    this.material = new THREE.MeshStandardMaterial({
      color: "rgb(255, 246, 77)",
      roughness: 0.1,
      metalness: 0.1,
      flatShading: false,
      ior: 2,
      reflectivity: 1,
      sheen: 2,
      sheenColor: "rgb(150,150,150)",
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // this.material = this.materials.getStandardMaterial();
    this.geometry.castShadow = true;
    this.geometry.receiveShadow = true;

    this.initialY = this.mesh.position.y;
    this.floorY = 0;

    // Store the height for later use
    this.height = this.buttonSize;
    this.scene.add(this.mesh);
  }

  togglePress() {
    // console.log(this.togglePress)
    if (this.clickable) {
      this.isPressed = !this.isPressed;

      this.startTransition(
        this.isPressed ? this.buttonSize / 0.9 : this.initialY
      );

      

      console.log(this.uid);

      FirebaseConfig.sendData(
        FirebaseConfig.DEFAULT_PATH + "/" + FirebaseConfig.UID,
        {
          target: this.uid,
          name: FirebaseConfig.NAME,
          date: Date.now(),
          position: this.isPressed ? "down" : "up",
        }
      );
    }
  }
  setupPosition() {
    this.spacing = 1.75;
    this.posY = 1;
    this.posZ = 5.39;
    this.mesh.position.x = -6.12 + this.index * this.spacing;
    this.mesh.position.y = this.posY;
    this.mesh.position.z = this.posZ;

    this.initialY = this.mesh.position.y;
  }

  setupAnimationState() {
    this.isPressed = false;
    this.isTransitioning = false;
    this.transitionProgress = 0;
    this.currentY = 0;
    this.targetY = 0;
    this.transitionSpeed = 0.03;
  }
  startTransition(targetY) {
    this.targetY = targetY;
    this.isTransitioning = true;
    this.transitionProgress = 0;
    this.currentY = this.mesh.position.y;
  }
  update() {
    if (!this.isTransitioning) return;

    //! Easing method
    this.transitionProgress = Math.min(
      this.transitionProgress + this.transitionSpeed,
      1
    );

    const eased = this.easeInOutCubic(this.transitionProgress);
    const newY = this.currentY + (this.targetY - this.currentY) * eased;
    this.mesh.position.y = newY;

    if (this.transitionProgress >= 1) {
      this.isTransitioning = false;
      this.mesh.position.y = this.targetY;
    }
  }
  easeInOutCubic(x) {
    return x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2;
  }

  get isDown() {
    return this.isPressed;
  }

  get isMoving() {
    return this.isTransitioning;
  }

  set positionY(y) {
    this.mesh.position.y = y;
  }
}
