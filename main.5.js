/**
 *  ThreeJS test file using the ThreeRender class
 */

//Loads all dependencies
requirejs(['ModulesLoaderV2.js'], function()
		{
			// Level 0 includes
			ModulesLoader.requireModules(["threejs/three.min.js"]) ;
			ModulesLoader.requireModules([ "myJS/ThreeRenderingEnv.js",
			                              "myJS/ThreeLightingEnv.js",
			                              "myJS/ThreeLoadingEnv.js",
			                              "myJS/navZ.js",
			                              "FlyingVehicle.js"]) ;
			ModulesLoader.requireModules(["ParticleSystem.js",
																		"Interpolators.js",
																		"MathExt.js"]);
			// Loads modules contained in includes and starts main function
			ModulesLoader.loadModules(start) ;
		}
) ;

function start()
{
	//	----------------------------------------------------------------------------
	//	MAR 2014 - TP Animation hélicoptère
	//	author(s) : Cozot, R. and Lamarche, F.
	//	----------------------------------------------------------------------------
	//	global vars
	//	----------------------------------------------------------------------------
	//	keyPressed
	var currentlyPressedKeys = {};

	//	rendering env
	var renderingEnvironment =  new ThreeRenderingEnv();

	//	lighting env
	var Lights = new ThreeLightingEnv('rembrandt','neutral','spot',renderingEnvironment,5000);

	//	Loading env
	var Loader = new ThreeLoadingEnv();

	// Camera setup
	renderingEnvironment.camera.position.x = 0 ;
	renderingEnvironment.camera.position.y = 0 ;
	renderingEnvironment.camera.position.z = 40 ;

	//	event listener
	//	---------------------------------------------------------------------------
	//	resize window
	window.addEventListener( 'resize', onWindowResize, false );
	//	keyboard callbacks
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;

	//Particles
	//Système de particules
/*
	var particles = {
		particlesCountMax: 10000,
		textureFile: "assets/particles/circle.png",
		blendingMode: THREE.AdditiveBlending
	};*/
/*
	var particlesEmitterD = {
		cone: {
				center: new THREE.Vector3(0,0,0),
				height: new THREE.Vector3(0,0,0),
				radius: 0.5,
				flow: 1000,
		},
		particle: {
			speed: new MathExt.Interval_Class(5, 10),
			mass: new MathExt.Interval_Class(0.1, 0.3),
			size: new MathExt.Interval_Class(0.1, 1),
			lifeTime: new MathExt.Interval_Class(1, 7)
		}
	};*/

	// var particlesEmitterG = {
	// 	cone: {
	// 			center: new THREE.Vector3(0,0,0),
	// 			height: new THREE.Vector3(0,0,0),
	// 			radius: 0.5,
	// 			flow: 1000,
	// 	},
	// 	particle: {
	// 		speed: new MathExt.Interval_Class(5, 10),
	// 		mass: new MathExt.Interval_Class(0.1, 0.3),
	// 		size: new MathExt.Interval_Class(0.1, 1),
	// 		lifeTime: new MathExt.Interval_Class(1, 7)
	// 	}
	// };


	var particlesFeature = new ParticleSystem.Engine_Class({
		particlesCountMax: 1000,
		textureFile: "assets/particles/particle.png",
		blendingMode: THREE.AdditiveBlending
	});

	var emitterParticlesD = new ParticleSystem.ConeEmitter_Class({
		cone: {
				center: new THREE.Vector3(0,0,0),
				height: new THREE.Vector3(0,-1,0),
				radius: 0.25,
				flow: 100,
		},
		particle: {
			speed: new MathExt.Interval_Class(5, 5),
			mass: new MathExt.Interval_Class(0.1, 0.1),
			size: new MathExt.Interval_Class(0.1, 5),
			lifeTime: new MathExt.Interval_Class(0.5, 1)
		}
	});
/*
	var emitterParticlesG = new ParticleSystem.ConeEmitter_Class({
		cone: {
				center: new THREE.Vector3(0,0,0),
				height: new THREE.Vector3(0,-1,0),
				radius: 0.2,
				flow: 100,
		},
		particle: {
			speed: new MathExt.Interval_Class(10, 10),
			mass: new MathExt.Interval_Class(0.1, 0.1),
			size: new MathExt.Interval_Class(0.1, 4),
			lifeTime: new MathExt.Interval_Class(0.5, 0.7)
		}
	});*/

	//var emitterParticles = new ParticleSystem.ConeEmitter_Class(particlesEmitterG);

	particlesFeature.addEmitter(emitterParticlesD);
	//particlesFeature.addEmitter(emitterParticlesG);

	//particlesFeature.addModifier(new ParticleSystem.ForceModifier_Weight_Class());

	particlesFeature.addModifier(new ParticleSystem.LifeTimeModifier_Class());

	particlesFeature.addModifier(new ParticleSystem.PositionModifier_EulerItegration_Class());

	particlesFeature.addModifier(new ParticleSystem.OpacityModifier_TimeToDeath_Class(
				new Interpolators.Linear_Class(0.7,0.9)
		));

	 /*
	particlesFeature.addModifier(new ParticleSystem.ColorModifier_TimeToDeath_Class(
				 {r:0.5,g:0,b:0},{r:0,g:0,b:0.5}
	 ));*/

	var particlesRotationX = new THREE.Object3D({
		position:{
			x: 0,
			y: 0,
			z: 0
		}
	});

 	particlesRotationX.add(particlesFeature.particleSystem);

	renderingEnvironment.addToScene(particlesRotationX);

	var clock = new THREE.Clock(true);


	//	callback functions
	//	---------------------------------------------------------------------------
	function handleKeyDown(event) { currentlyPressedKeys[event.keyCode] = true;}
	function handleKeyUp(event) {currentlyPressedKeys[event.keyCode] = false;}

	function handleKeys() {
		if (currentlyPressedKeys[67]) // (C) debug
		{
			// debug scene
			renderingEnvironment.scene.traverse(function(o){
				console.log('object:'+o.name+'>'+o.id+'::'+o.type);
			});
		}
		var rotationIncrement = 0.05 ;
		if (currentlyPressedKeys[68]) // (D) Right
		{
			particlesRotationX.rotation.x += 0.5
			//renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0), rotationIncrement) ;
		}
		if (currentlyPressedKeys[81]) // (Q) Left
		{
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0), -rotationIncrement) ;
		}
		if (currentlyPressedKeys[90]) // (Z) Up
		{
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(1.0,0.0,0.0), rotationIncrement) ;
		}
		if (currentlyPressedKeys[83]) // (S) Down
		{
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(1.0,0.0,0.0), -rotationIncrement) ;
		}
	}

	//	window resize
	function  onWindowResize()
	{
		renderingEnvironment.onWindowResize(window.innerWidth,window.innerHeight);
	}

	function render() {
		requestAnimationFrame( render );
		handleKeys();

		var deltaTime = clock.getDelta();

		particlesFeature.animate(deltaTime, renderingEnvironment);
		// Rendering
		renderingEnvironment.renderer.render(renderingEnvironment.scene, renderingEnvironment.camera);
	};

	render();
}
