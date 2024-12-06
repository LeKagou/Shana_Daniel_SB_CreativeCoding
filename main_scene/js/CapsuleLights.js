import * as THREE from 'three';

export default class CapsuleLights {
    constructor(scene) {
        this.scene = scene;
        this.Status = 0;
        this.LEDS = [];
        this.init();
    }

    init() {
        for(let i = 0; i < 6;i++){
            let geometry = new THREE.CapsuleGeometry( 0.15, 0.05, 8, 16 ); 
            let material = new THREE.MeshStandardMaterial( { 
                color: "black",
                flatShading: false,
                metalness:0,
                roughness:1,
            } );
            let capsule = new THREE.Mesh( geometry, material ); 
            this.scene.add( capsule );
            capsule.position.set(7.25, 0.52, 3.5 - (1.4 * i));
            capsule.receiveShadow = true;
            capsule.rotation.set(0, 0, this.degreeToRadians(90));
            this.LEDS.push(capsule);
        }
        this.LEDS.reverse();
    }

    LighUp(elementIndex){
        this.LEDS[elementIndex].material.color.setHex(0x00ff00);
    }

    LighOff(elementIndex){
        this.LEDS[elementIndex].material.color.setHex(0x000000);
    }

    degreeToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
}