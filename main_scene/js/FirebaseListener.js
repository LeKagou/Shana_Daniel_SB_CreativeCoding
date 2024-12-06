import FirebaseConfig from "./FirebaseConfig.js";
import DebugLayer from "./UI_tools/DebugLayer.js";

/**
 * Classe qui écoute les changements dans Firebase et met à jour les shapes en conséquence
 */
export default class FirebaseListener {
  /**
   * Initialise l'écouteur Firebase
   * @param {Array} shapes - Tableau des shapes à contrôler
   */
  constructor(pieces, lightPlane, CapsuleLights) {
    this.pieces = pieces;
    this.lightPlane = lightPlane;
    this.firstCall = false;
    this.CapsuleLights = CapsuleLights;
    //this.initDebugLayer();
    this.setupListener();
  }

  /**
   * Initialise la couche de débogage
   */
  initDebugLayer() {
    this.debugLayer = new DebugLayer();
  }

  /**
   * Configure l'écouteur sur le nœud "connections" de Firebase
   */
  setupListener() {
    FirebaseConfig.listenToData(FirebaseConfig.DEFAULT_PATH, (data) => {
      // Ignore le premier appel pour éviter les effets indésirables à l'initialisation
      if (!this.firstCall) {
        this.firstCall = true;
        return;
      }

      this.handleFirebaseData(data);
    });
  }

  /**
   * Gère les données reçues de Firebase
   * @param {Object} data - Données reçues de Firebase
   */
  handleFirebaseData(data) {
    // Ajoute le message à la couche de débogage
    //this.debugLayer.addMessage(data);

    // Traite chaque entrée de données
    Object.keys(data).forEach((key) => {
      this.processDataEntry(key, data[key]);
    });
  }

  /**
   * Traite une entrée de données spécifique
   * @param {string} key - Clé de l'entrée
   * @param {Object} entry - Données de l'entrée
   */
  processDataEntry(key, entry) {
    if (entry.target === FirebaseConfig.UID) {
      Object.values(this.pieces).forEach((piece) => {
        if (this.shouldActivatePiece(piece, key, entry)) {
          let index = piece.index;
          //!!!dcdsds
          console.log(index, entry.position);
          if (entry.position === "down") {
            this.CapsuleLights.LighUp(index);
          } else if (entry.position === "up") {
            this.CapsuleLights.LighOff(index);
          }
          piece.activate(entry);
        }
      });
    }
  }

  /**
   * Vérifie si un shape doit être activé
   * @param {Shape} shape - Le shape à vérifier
   * @param {string} key - Identifiant de l'entrée
   * @param {Object} entry - Données de l'entrée
   * @returns {boolean} - Vrai si le shape doit être activé
   */
  shouldActivatePiece(piece, key, entry) {
    if (piece.uid !== key || piece.clickable) return false;

    // // Vérifie si un changement d'état est nécessaire
    /*return !(
       (piece.isPressed && entry.position === "up") ||
       (!piece.isPressed && entry.position === "down")
    );*/
    if (key === piece.uid) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Met à jour la référence aux shapes si nécessaire
   * @param {Array} newShapes - Nouveau tableau de shapes
   */
  updateCubes(newShapes) {
    this.shapes = newShapes;
  }
  /**
   * Met à jour la référence à la couche de débogage si nécessaire
   * @param {DebugLayer} newDebugLayer - Nouvelle couche de débogage
   */
  updateDebugLayer(newDebugLayer) {
    this.debugLayer = newDebugLayer;
  }
}
