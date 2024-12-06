import * as THREE from "three";
import { lerp } from "three/src/math/MathUtils.js";

export default class Piece {
  constructor(obj) {

    this.obj = obj;
    this.mixers = [];
    this.clickable = false;
    this.uid = null;
    this.index = null;

    this.isPlaying = false;
    this.isReversed = false;
    this.speed = 0.1;
    this.targetPos = null;
    this.rotatePos = null;

    this.pieceState = 0;
    this.finished = false;

    this.rotateLoop = false;
    this.clock = new THREE.Clock();
    this.StartPos = obj.position;

    this.old_date = null;
    
  }

  definePositions(offsetOBJ, finalPos) {
    this.Positions = [
      {
        pos: new THREE.Vector3(this.obj.position.x, 0.35, this.obj.position.z),
        rot: new THREE.Vector3(this.degreesConvertor(90),this.degreesConvertor(offsetOBJ.y),0)
      },
      {
        pos: new THREE.Vector3(this.obj.position.x, 2.5, this.obj.position.z),
        rot: new THREE.Vector3(this.degreesConvertor(90),0,0)
      },
      {
        pos: new THREE.Vector3(5.2, 2.5, -3.75 + this.index * 1.5),
        rot: new THREE.Vector3(this.degreesConvertor(0),0,0)
      },
      {
        pos: new THREE.Vector3(5.2, 2.5, finalPos),
        rot: new THREE.Vector3(this.degreesConvertor(0),0,0)
      },
    ];
  }

  LoadAndCreateAnimation() {
    let mixer = new THREE.AnimationMixer(this.obj);
    this.action = mixer.clipAction(this.obj.animations[0]);
    this.action.clampWhenFinished = true;
    this.action.setLoop(THREE.LoopOnce);
    this.mixers.push(mixer);
  }

  animate() {
    this.mixers.forEach((mixer) => {
      mixer.update(this.clock.getDelta());
    });
    /*
        if(this.Move) {
            if(this.obj.position.distanceTo(this.targetPos) < 0.1) {
                this.Move = false;
                return;
            }else{
                this.obj.position.lerp(this.targetPos, this.speed);
            }
        }

        if(this.Rotating){
            this.obj.rotation.x = lerp(, this.rotatePos.x, 0.1);
            this.obj.rotation.y = lerp(, this.rotatePos.y, 0.1);
            this.obj.rotation.z = lerp(, this.rotatePos.z, 0.1);
        }*/


       this.obj.position.lerp(this.Positions[this.pieceState].pos, this.speed);
       
       this.obj.rotation.x = lerp(this.obj.rotation.x,this.Positions[this.pieceState].rot.x, 0.1);
       this.obj.rotation.y = lerp(this.obj.rotation.y,this.Positions[this.pieceState].rot.y, 0.1);
       this.obj.rotation.z = lerp(this.obj.rotation.z,this.Positions[this.pieceState].rot.z, 0.1);

    /*
        if(this.rotateLoop){
            this.obj.rotation.z += 0.01;
            if(this.obj.rotation.z >= 6.28319){
                this.obj.rotation.z = 0;
            }
        }else{
            if(this.obj.rotation.z > 0){
                this.obj.rotation.z -= 0.25;
                if(this.obj.rotation.z < 0){
                    this.obj.rotation.z = 0;
                }
            }
        }*/
  }

  async activate(entry) {
    const position = entry.position;

    if (this.action) {
      if (!this.isPlaying && position == "down" && entry.date!=this.old_date) {
        this.old_date = entry.date;
        console.log("pos:",position)
        this.positionGood = true;
        await this.phase1();
      } else if(position == "up" && entry.date!=this.old_date){
        this.old_date = entry.date;
        console.log("back:",position)
        await this.phaseBack();
      }
    }
  }

  //! Animation steps
  async phase1() {
    this.pieceState = 1;
    await this.delay(250);
    this.isPlaying = true;
    this.isReversed = false;
    this.action.reset();
    this.action.clampWhenFinished = true;
    this.action.timeScale = 1;
    this.action.play();
    await this.delay(1500);
    this.pieceState = 2;
    await this.delay(500);
    this.finished = true;
  }

  async phaseBack() {
    this.finished = false;
    this.pieceState = 2;
    await this.delay(1000);
    this.pieceState = 1;
    await this.delay(1200);

    this.isReversed = !this.isReversed;
    this.action.reset();
    this.action.time = this.action.getClip().duration;
    this.action.timeScale = -1;
    this.action.play();
    this.isPlaying = false;

    await this.delay(250);
    this.pieceState = 0;
  }
  //!--------------------

  async goFinal(){
    console.log("goFinal");
    await this.delay(1000);
    this.pieceState = 3;
  }

  degreesConvertor(degrees) {
    return (degrees * Math.PI) / 180;
  }
  //faire un dely async
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
