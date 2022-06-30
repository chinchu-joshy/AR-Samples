import { GLTFLoader } from "./js/GLTFLoader.js";
import { Stats } from "./js/stats.module.js";
import { CanvasUI } from "./js/CanvasUI.js";
import { ARButton } from "./js/arbutton.js";
import { FBXLoader } from "./js/fbxloader.js";

import {
  Constants as MotionControllerConstants,
  fetchProfile,
} from "./js/motion-controllers.module.js";

let camera, scene, renderer;
// let controller, textureBase, textureWall, texture, textureRoof, ventTexture;
class App {
  constructor() {
    this.fbxLoader = new FBXLoader();
    const container = document.createElement("div");
    const text = document.createElement("p");
    const canvas = document.querySelector("canvas.webgl");
    // document.body.appendChild( container );
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 4);
    this.scene = new THREE.Scene();


    const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    this.scene.add( ambientLight );
    const ambient = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2);
    this.scene.add(ambient);
    const light = new THREE.DirectionalLight(0xffffff,.8);
    light.position.set(3, 5, 3);
    this.scene.add(light);





    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas: canvas,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.xr.enabled = true;
    /* -------------------------- adding the fbx model -------------------------- */
   
    const texture = new THREE.TextureLoader().load("Model/walnut-normal.jpg");
    const textureWall = new THREE.TextureLoader().load("Model/wall-3.png");
    const textureRoof = new THREE.TextureLoader().load("Model/RusticBlack.jpeg");
   const textureBase = new THREE.TextureLoader().load("Model/base.jpg");
   
   const ventTexture = new THREE.TextureLoader().load("Model/Venttexture.jpg");
    this.fbxLoader.load("Model/model-3.fbx",  (object)=> {
      // (draggable.children[0].material.clippingPlanes = clipPlanes),
      // console.log(draggable)
      object.traverse(function (child) {
        if (child.isMesh && child.name.includes("Shed_SaltBox")) {
           
            child.material = new THREE.MeshPhongMaterial();
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.map = textureBase;
            child.material.bumpScale = 0.4;
            child.material.map.wrapS = THREE.RepeatWrapping;
            child.material.map.wrapT = THREE.RepeatWrapping;
            // child.material.color = new THREE.Color(0x7A5850);
            
            child.material.needsUpdate = true;
            
        }
        if (child.isMesh && child.name.includes("Trim")) {
          child.material = new THREE.MeshPhongMaterial();
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.bumpMap = texture;
          child.material.bumpScale = 0.03;
          child.material.bumpMap.wrapS = THREE.RepeatWrapping;
          child.material.bumpMap.wrapT = THREE.RepeatWrapping;
          child.material.color = new THREE.Color(0xffffff);
          child.material.bumpMap.needsUpdate = true;
          child.material.needsUpdate = true;
          child.userData.draggable = false;
          child.userData.name = "trim";
          child.userData.limit = true;
        }
        if (child.name.includes("Ridge_Cap")) {
          child.visible = false;
        }
        if (child.name.includes("_40_year_Metal_Roofing")) {
          child.visible = false;
        }
        if (child.name.includes("EXTERIOR_OPTIONS")) {
          child.visible = false;
        }
        if (child.name.includes("Shed_SaltBox_10x10_Sidewall")) {
          child.traverse((value) => {
            if (
              value.isMesh &&
              (value.name == "left_side" ||
                value.name == "back_side" ||
                value.name == "right_side" ||
                value.name == "front_side")
            ) {
                value.material = new THREE.MeshStandardMaterial();
                value.material.bumpScale = 0.01;
                value.material.color = new THREE.Color(0x382c16);
                value.material.DoubleSide = true;
                value.material.bumpMap = textureWall;
                value.material.bumpMap.repeat.set(4, 4);
                value.material.bumpMap.wrapS = THREE.RepeatWrapping;
                value.material.bumpMap.wrapT = THREE.RepeatWrapping;
                value.material.bumpMap.needsUpdate = true;
                value.material.needsUpdate = true;
                value.userData.draggable = false;
                value.userData.name = "sidewall";
                value.userData.limit = true;
            }
            if (
              value.name == "left_outline" ||
              value.name == "right_outline" ||
              value.name == "front_outline" ||
              value.name == "back__outline"
            ) {
              value.visible = false;
            }
          });
        }
        if (child.name.includes("Roofing")) {
          child.traverse((value) => {
            if (value.isMesh && value.name?.includes("Archite")) {
              value.material = new THREE.MeshPhongMaterial();
              value.material.map = textureRoof;
            //   console.log(value.material)
              value.material.map.wrapS = THREE.RepeatWrapping;
              value.material.map.wrapT = THREE.RepeatWrapping;
              value.material.map.repeat.set(6, 6);
              value.userData.draggable = false;
              value.userData.name = "roof";
              value.userData.limit = true;
            }
          });
        }
        if (child.name.includes("Grid")) {
          child.visible = false;
        }
      });
      object.position.set(0, 0, 0);
    
    
      object.scale.set(0.005, 0.005, 0.005);


 this.scene.add(object);
    });
    
      this.fbxLoader.load("Model/vent.fbx", (object) => {
       console.log("checking")
       object.position.set(.3,1.2,.8);
       object.scale.set(0.07, 0.07, 0.07);
        // object.position.set(13, 49.8, 14);
        object.traverse((child) => {
          if (child.isMesh && child.name.includes("Vent")) {
            // const pass = new SMAAPass( window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio() );
            // composer.addPass( pass );
           
            child.material = new THREE.MeshPhongMaterial();
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.map = ventTexture;
            child.material.map.wrapS = THREE.RepeatWrapping;
            child.material.map.wrapT = THREE.RepeatWrapping;
            
            child.scale.set(0.1, 0.1, 0.1);
            child.rotation.y = Math.PI;
            child.material.color = new THREE.Color(0xffffff);
            child.material.needsUpdate = true;
            child.material.map.needsUpdate = true;
          }
        });
        this.scene.add(object);
        

      });
      this.fbxLoader.load("Model/doubleDoor.fbx", (object) => {
       
        object.traverse((door) => {
          window.door = object;
          if (door.isMesh && door.name.includes("ramp")) {
            door.visible = false;
          }
          if (
            door.name.includes("Double__Door") ||
            door.name.includes("Standard_Door") ||
            door.name.includes("DoubleDoor_HingeFrame") ||
            door.parent.name.includes("DoubleDoor_HingeFrame") ||
            door.parent.name.includes("Standard_Door")
          ) {
            // console.log(door);
            door.visible = true;
          } else {
            door.visible = false;
          }
          if (door.name.includes("DoorWood")) {
            door.material = new THREE.MeshStandardMaterial();
            door.material.bumpMap = textureWall;
            //door.material.map = textureWall;
            door.material.bumpScale = 0.01;
            door.material.color = new THREE.Color(0x382c16);
            door.material.bumpMap.needsUpdate = true;
            door.material.needsUpdate = true;
          }
          if (door.name.includes("Trim_side")) {
            door.material = new THREE.MeshPhongMaterial();
            door.material.bumpMap = texture;
            //door.material.map = texture;
            door.material.bumpScale = 0.03;
            door.material.bumpMap.wrapS = THREE.RepeatWrapping;
            door.material.bumpMap.wrapT = THREE.RepeatWrapping;
            door.material.color = new THREE.Color(0xffffff);
            door.material.bumpMap.needsUpdate = true;
            door.material.needsUpdate = true;
          }
          if (door.name.includes("Awning")) {
            door.visible = false;
          }
        });
        object.position.set(.1,.6, .8);
        object.scale.set(0.005, 0.005, 0.005);
        object.rotation.y = -Math.PI / 2;
        object.userData.draggable = true;
        this.scene.add(object);
      });


    /* ---------------------------- adding fbx model ---------------------------- */

    const geometry = new THREE.BoxBufferGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(geometry, material);
    // this.scene.add(this.mesh);
    const controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.renderer.setAnimationLoop(this.render.bind(this));
    window.addEventListener("resize", this.resize.bind(this));
    document.body.appendChild(ARButton.createButton(this.renderer));
  }
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
export { App };
