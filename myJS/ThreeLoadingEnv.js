// ThreeLoadingEnv
//----------------------------------------------------------------------------------------
// RC
//----------------------------------------------------------------------------------------

if(typeof(ModulesLoader)=="undefined")
{
	throw "ModulesLoaderV2.js is required to load script ThreeLoadingEnv.js" ; 
}
// Loads dependencies and initializes this module
ModulesLoader.requireModules(['threejs/three.min.js',
							 'js/loaders/ColladaLoader.js',
                             "js/loaders/MTLLoader.js", 
                             "js/loaders/OBJMTLLoader.js",
                             "DebugHelper"]) ;

// constructor
function ThreeLoadingEnv(){
	// attributes
	// --------------------------------------
	// no			
	
	// methods
	// --------------------------------------

	// loadMesh
	// inputs
	//------------------------
	// path: path to file (String)
	// file: filename (String)
	// format: scene format 'obj' or 'dae' (string)
	// scene: Object3D parent in the scene graph (Object3D)
	// name: Object3D name
	// posX, posY,posZ: translation (float)
	// side: 'front' or 'back' or 'double' (string)
	// @return the root node of the loaded object
	this.loadMesh = function(path,file,format,scene,name,posX,posY,posZ,side){
		var loader ;
		var newNode = new THREE.Object3D();
		newNode.position.set(posX, posY, posZ) ;
		scene.add(newNode) ;
		newNode.name = name ;
		switch(format){
			case "obj":
				this.loadObj(path, file, newNode, name, posX, posY, posZ, side) ;
				break;
			case "dae":
				this.loadDae(path, file, newNode, name, posX, posY, posZ, side) ;
				break ;
			default:
				console.error('Unrecognized file extension: '+format) ;
				break ;
		}
		return newNode ;
	}

	/** Loads a geometry file
	 * 
	 *  @param descriptor data structure with the following fields:
	 *  		filename {String} The full filename with path and extension
	 *  		node The node of the scene graph under which the loaded geometry will be added
	 *  		name The name given to the loaded object
	 *  		side (optional, default='front') 'front' or 'back' or 'double' (string)
	 *  		transX (optional, default=0.0) The X component of the initial translation
	 *  		transY (optional, default=0.0) The Y component of the initial translation
	 *  		transZ (optional, default=0.0) The Z component of the initial translation
	 *  @return The root node of the loaded object
	 */
	this.load = function(descriptor)
	{
		// Default values
		if(!descriptor.hasOwnProperty('transX')) { descriptor.transX = 0.0 ; } 
		if(!descriptor.hasOwnProperty('transY')) { descriptor.transY = 0.0 ; } 
		if(!descriptor.hasOwnProperty('transZ')) { descriptor.transZ = 0.0 ; } 
		if(!descriptor.hasOwnProperty('side')) { descriptor.side = 'front' ; }
		DebugHelper.requireAttribute(descriptor, 'filename', 'ThreeLaodingEnv.load: filename attribute is required') ;
		DebugHelper.requireAttribute(descriptor, 'node', 'ThreeLaodingEnv.load: node attribute is required') ;
		DebugHelper.requireAttribute(descriptor, 'name', 'ThreeLaodingEnv.load: name attribute is required') ;
		// Extraction of path data
		var lastDot = descriptor.filename.lastIndexOf('.') ;
		var lastSlash = descriptor.filename.lastIndexOf('/') ;
		var path = descriptor.filename.substr(0, lastSlash) ;
		var extension = descriptor.filename.substr(lastDot+1, descriptor.filename.length-(lastDot+1)) ;
		var file = descriptor.filename.substr(lastSlash+1, (lastDot-1)-(lastSlash+1)+1) ;
		// Call to loadMesh
		//console.log('Loading: '+path+'/'+file+'.'+extension) ;
		return this.loadMesh(path, file, extension, descriptor.node, descriptor.name, descriptor.transX, descriptor.transY, descriptor.transZ, descriptor.side) ;
	}
	
	this.loadDae = function(path,file,parentNode,name,posX,posY,posZ,side)
	{		
		/** Callback called once the geometry is loaded
		 * 
		 * @param object The loaded geometry
		 */
		function onSuccess(object) 
		{
			// side
//			switch(side){
//				case "double":
//					// force to double side
//					object.scene.traverse(function(ob){
//						if (ob.type == 'Mesh'){ob.material.side= THREE.DoubleSide ; }
//					});
//				break ;
//				case "back":
//					// force to back side
//					object.scene.traverse(function(ob){
//						if (ob.type == 'Mesh'){ob.material.side= THREE.BackSide ; }
//					});
//				break ;
//			}
			console.log( 'ThreeLoadingEnv.load:: '+name+':: '+'added !' );
			// Adds the geometry to the parent node
			parentNode.add(object.scene) ;
		}
		
		/**
		 * Callback called on load progresss
		 */
		function onProgress() {}
		
		// Creates a loader and loads the file
		var loader = new THREE.ColladaLoader() ;
		var filename = path+'/'+file+'.dae' ;
		loader.load(filename, onSuccess, onProgress) ;
	}
	
	this.loadObj = function(path,file,scene,name,posX,posY,posZ,side)
	{
		loader = new THREE.OBJMTLLoader();
		// files
		var mesh = path+'/'+file+'.obj';
		var mat = path+'/'+file+'.mtl';
		//
		loader.load(mesh,mat,
			function(o){	// on load
				// side
				switch(side){
					case "double":
						// force to double side
						o.traverse(function(ob){
							if (ob.type == 'Mesh'){ob.material.side= THREE.DoubleSide ; }
						});
					break ;
					case "back":
						// force to back side
						o.traverse(function(ob){
							if (ob.type == 'Mesh'){ob.material.side= THREE.BackSide ; }
						});
					break ;
				}
				// add to scene
				scene.add(o);	
				console.log( 'ThreeLoadingEnv.load:: '+name+':: '+'added !' );
			},
			function ( xhr ) { // on progress
				if ( xhr.lengthComputable ) {
					var percentComplete = xhr.loaded / xhr.total * 100;
					var percent = Math.round(percentComplete, 2);
					console.log( 'ThreeLoadingEnv.load:: '+name+':: '+percent + '% downloaded' );
				}
			},
			function ( xhr ) { // on error
				console.log( 'ThreeLoadingEnv.load:: '+name+':: '+'loading error' );
			}
		);
	}
	
	// loadSkyBox
	// inputs
	//------------------------
	// path: path to file (String)
	// files: filenames (String[])
	// format: image format 'jpg'
	// scene: Object3D parent in the scene graph (Object3D)
	// name: Object3D name
	// size: box size (float)
	// example
	// Loader.loadSkyBox('assets',['px','nx','py','ny','pz','nz'],'jpg', RC.scene, 'sky',4000);
	this.loadSkyBox = function(path,files,format,scene,name,size){
		// files names
		var urls= [];
		for (var i in files){urls.push(path+'/'+files[i]+'.'+format);}
		// cube texture
		var textureCube = THREE.ImageUtils.loadTextureCube( urls );	
		// cube shader
		var shader = THREE.ShaderLib[ "cube" ];
		shader.uniforms[ 'tCube' ].value = textureCube;
		var material = new THREE.ShaderMaterial( 
			{
				fragmentShader: shader.fragmentShader,
				vertexShader: shader.vertexShader,
				uniforms: shader.uniforms,
				side: THREE.BackSide
			}
		);
		var cube = new THREE.Mesh( new THREE.BoxGeometry( size, size, size), material );
		cube.name = name;
		scene.add( cube );	
	}
}
