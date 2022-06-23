import { GLTFLoader } from "./js/GLTFLoader.js";
import { Stats } from "./js/stats.module.js";
import { CanvasUI } from "./js/CanvasUI.js";
import { ARButton } from "./js/arbutton.js";
import {
  Constants as MotionControllerConstants,
  fetchProfile,
} from "./js/motion-controllers.module.js";
class App{
	constructor(){
		const container = document.createElement( 'div' );
		var text = document.createTextNode("Tutorix is the best e-learning platform");
		container.appendChild(text)
		const canvas = document.querySelector("canvas.webgl");
		console.log(container)
		document.body.appendChild( container );
		this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 100 );
		this.camera.position.set( 0, 0, 4 );
		this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color( 0xaaaaaa );
		const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.3);
		this.scene.add(ambient);
        const light = new THREE.DirectionalLight();
        light.position.set( 0.2, 1, 1);
        this.scene.add(light);	
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( this.renderer.domElement );
        const geometry = new THREE.BoxBufferGeometry();
        const material = new THREE.MeshStandardMaterial( { color: 0xFF0000 });
        this.mesh = new THREE.Mesh( geometry, material );
        this.scene.add(this.mesh);
        const controls = new  THREE.OrbitControls( this.camera, this.renderer.domElement );
        this.renderer.setAnimationLoop(this.render.bind(this));
        window.addEventListener('resize', this.resize.bind(this) );
		document.body.appendChild(ARButton.createButton(this.renderer));
	}	
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
	render() {   
        this.mesh.rotateY( 0.01 );
        this.renderer.render( this.scene, this.camera );
    }
}
export { App };