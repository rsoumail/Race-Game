// ThreeRenderingEnv
//----------------------------------------------------------------------------------------
// RC
//----------------------------------------------------------------------------------------
// constructor
function ThreeRenderingEnv(){
	// attributes
	// --------------------------------------

	// scene
	this.scene = new THREE.Scene() ;
	this.scene.name = 'root' ;
	//this.scene.fog =  new THREE.FogExp2( 0x5876A4, 0.003 );

	// camera
	this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.01, 5000 );

	// renderer
	this.renderer = new THREE.WebGLRenderer(); 
	// default background color
	this.renderer.setClearColor(0x404080, 1);
	this.renderer.shadowMapEnabled = true;
	this.renderer.shadowMapType = THREE.PCFShadowMap;
	// render size
	this.renderer.setSize( window.innerWidth, window.innerHeight ); 


	// init
	// --------------------------------------
	// add a canvas to display the scene
	document.body.appendChild( this.renderer.domElement ); 


	// methods
	// --------------------------------------
	// add
	this.addToScene = function(obj3d){this.scene.add(obj3d);}
	
	// onWindoResize
	this.onWindowResize = function(w,h) {
		this.camera.aspect = w / h;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( w, h );
	}
}