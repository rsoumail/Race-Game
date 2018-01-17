// ThreeLightingEnv
//----------------------------------------------------------------------------------------
// RC
//----------------------------------------------------------------------------------------
// Three point lighting
//  --- Key Light
//  --- Fill Light
//  --- Back Light
// Lighting Set
//  --- High Key
//  --- Low Key
//  --- Rembrandt
// Color & Harmonie
//  --- Neutral 
//  --- Cold
//  --- Warm
//  --- biColor
// Technical setup
//  --- spot | dir
//----------------------------------------------------------------------------------------
// constructor
function ThreeLightingEnv(LightingSet,ColorHarmonie,spotDir,root,dist){
	// distance
	this.distance = dist;
	// lights
	this.keyLight;
	this.fillLight;
	this.backLight;
	// object3D : lightRoot
	var O3D = new THREE.Group();
	O3D.name = 'lightRoot';
	//this.lightRoot = new THREE.Object3D();
	//this.LightRoot.name = 'lightRoot';
	// Light type :  spot or directionnal
	switch(spotDir){
		case "spot":
			// use spotLight
			// add three spotlight lights
			// key light
			this.keyLight  = new THREE.SpotLight( 0xffffff, 1.0 );
			this.keyLight.position.set( 0*this.distance, -1.0*this.distance, 0.5*this.distance );
			this.keyLight.castShadow = true ;
			this.keyLight.shadowDarkness  = 0.10 ;
			O3D.add(this.keyLight);
			// fill light
			this.fillLight  = new THREE.SpotLight( 0x303030, 1.0);
			this.fillLight.position.set( 0.866*this.distance, 0.5*this.distance, 0.5*this.distance );
			this.fillLight.castShadow = true ;
			this.fillLight.shadowDarkness  = 0.10 ;
			O3D.add(this.fillLight);
			// back light
			this.backLight  = new THREE.SpotLight( 0xffffff, 1.0 );
			this.backLight.position.set( -0.866*this.distance, 0.5*this.distance, 0.866*this.distance );
			this.backLight.castShadow = true ;
			this.backLight.shadowDarkness  = 0.10 ;
			O3D.add(this.backLight);
			break;
		case "dir":
			// use directionnal light
			// add three directionnal lights
			// key light
			this.keyLight  = new THREE.DirectionalLight( 0xffffff, 1.0 );
			this.keyLight.position.set( 0, 1, 0.5 ).normalize();
			//this.keyLight.castShadow = true ;
			O3D.add(this.keyLight);
			// fill light
			this.fillLight  = new THREE.DirectionalLight( 0x303030, 1.0);
			this.fillLight.position.set( 0.866, -0.5, 0.5 ).normalize();
			//this.fillLight.castShadow = true ;
			O3D.add(this.fillLight);
			// back light
			this.backLight  = new THREE.DirectionalLight( 0xffffff, 1.0 );
			this.backLight.position.set( -0.866, -0.5, 0.866 ).normalize();
			//this.backLight.castShadow = true ;
			O3D.add(this.backLight);
			break;
		default:
			console.log('ThreeLightingEnv:: '+spotDir+' must be: spot or dir');
	}
	// color Harmonie : neutral or cold or bi color
	// neutral : all light are white
	// cold : blue fill light
	// warm :red fill light
	// bicolor : red key light, blue fill light
	switch(ColorHarmonie){
		case "neutral":
			// changebackground
			root.renderer.setClearColor(0x303030, 1);
			break;
		case "cold":
			// change key and fill light
			this.keyLight.color.setRGB(0.66,1.0,1.0);
			this.fillLight.color.setRGB(0.1,0.1,0.8);
			root.renderer.setClearColor(0x202030, 1);
			break;
		case "warm":
			// change fill light
			this.keyLight.color.setRGB(1.0,1.0,0.66);
			this.fillLight.color.setRGB(1.0,0.1,0.1);
			root.renderer.setClearColor(0x302020, 1);
			break ;
		case "bicolor":
			// change key and fill light
			this.keyLight.color.setRGB(1.0,0.2,0.0);
			this.fillLight.color.setRGB(0.0,0.2,1.0);
			root.renderer.setClearColor(0x302030, 1);
			break ;
		default:
			console.log('ThreeLightingEnv:: '+ColorHarmonie+' must be: neutra, cold, warm or bicolor');
	}
	// LightingSet : highkey,lowkey, rembrandt
	switch(LightingSet){
		case "highkey":
			// dont change
			break;
		case "lowkey":
			// change fill light
			O3D.rotation.z = - 120*3.14/180.0 ;
			break ;
		case "rembrandt":
			// change key and fill light
			O3D.rotation.z = - 45*3.14/180.0 ;
			break ;
		default:
			console.log('ThreeLightingEnv:: '+LightingSet+' must be: highkey or lowkey or rembrandt');
	}
	root.addToScene(O3D);
	
}