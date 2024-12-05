import * as THREE from "three";

/**
 * Classe gérant les interactions utilisateur avec les button
 * Permet de détecter et gérer les clics sur les button
 */
export default class Interaction {
  /**
   * Initialise le gestionnaire d'interactions
   * @param {THREE.Camera} camera - Caméra de la scène
   * @param {THREE.Scene} scene - Scène Three.js
   * @param {Array} button - Tableau des button interactifs
   */
  constructor(camera, scene, buttons) {
    this.camera = camera;
    this.scene = scene;
    this.buttons = buttons;

    // Initialisation du raycaster pour la détection des clics
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    window.addEventListener("click", this.onClick.bind(this));
  }

  /**
   * Gère les événements de clic
   * @param {Event} event - Événement de clic
   */
  onClick(event) {
    // Conversion de la position de la souris en coordonnées normalisées
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Lance un rayon depuis la caméra à travers la position de la souris
    this.raycaster.setFromCamera(this.mouse, this.camera);


    //console.log("clcick")
    const intersects = this.raycaster.intersectObjects(
      this.buttons.map((button) => button.mesh)
    );


    // Vérifie si un cube a été touché
    if (intersects.length > 0) {


      const clickedButton = this.buttons.find(
        (cube) => cube.mesh === intersects[0].object
      );

      if (clickedButton) {
        clickedButton.togglePress();
      }
    }

  }

  /**
   * Met à jour l'état des interactions
   * Pas d'animations nécessaires - les changements de position sont immédiats
   */
  update() {
    // Aucune mise à jour d'animation nécessaire
  }

  /**
   * Nettoie les écouteurs d'événements
   */
  dispose() {
    window.removeEventListener("click", this.onClick);
  }
}
