if(typeof(ModulesLoader)=="undefined")
{
	throw "ModulesLoaderV2.js is required to load script Helicopter.js" ;
}
// Loads dependencies and initializes this module
ModulesLoader.requireModules(['threejs/three.min.js', 'Physics.js', 'DebugHelper.js']) ;

/** An Helicopter
 *
 * @param configuration
 * @returns {Helicopter}
 */
function Helicopter(configuration)
{
  if(!configuration.hasOwnProperty('position')) { configuration.position = new THREE.Vector3(0.0,0.0,0.0) ; }
	if(!configuration.hasOwnProperty('mass')) { configuration.mass = 50 ; }
	if(!configuration.hasOwnProperty('xLength')) { configuration.xLength = 5 ; }
	if(!configuration.hasOwnProperty('yLength')) { configuration.yLength = 2 ; }
	if(!configuration.hasOwnProperty('zLength')) { configuration.zLength = 2 ; }
	if(!configuration.hasOwnProperty('xAngle')) { configuration.xAngle = 0.5 ; }
	if(!configuration.hasOwnProperty('yAngle')) { configuration.yAngle = 0.5 ; }
	if(!configuration.hasOwnProperty('zAngle')) { configuration.zAngle = 0.0 ; }

  /* Add 3D object which embeded all helicopter parts */
  //this.helicopter = new THREE.Object3D();
  this.position = configuration.position
  this.speed = new THREE.Vector3(0.0,0.0,0.0) ;
	this.mass = configuration.mass ; //50.0 ;

  this.speed = new THREE.Vector3(0.0,0.0,0.0) ;
  this.force = new THREE.Vector3(0.0,0.0,0.0) ;
	this.momentum = new THREE.Vector3(0.0,0.0,0.0) ;

  this.angles = new THREE.Vector3(configuration.xAngle, configuration.yAngle, configuration.zAngle) ;
	this.angularSpeed = new THREE.Vector3(0.0,0.0,0.0) ;

	this.xLength = configuration.xLength ;
	this.yLength = configuration.yLength  ;
	this.zLength = configuration.zLength  ;

	this.force = new THREE.Vector3(0.0,0.0,0.0) ;
	this.momentum = new THREE.Vector3(0.0,0.0,0.0) ;

  this.turn = false ;

  this.composeParts = function(helicopter, Loader){
    /* Add helicopter body */
    helicopter.position.x = this.position.x ;
    helicopter.position.y = this.position.y ;
    helicopter.position.z = this.position.z ;

    this.helicoCorp = new THREE.Object3D();
    this.helicoCorp.position.set(0, 0, 0) ;
    Loader.load({filename: 'assets/helico/helicoCorp.obj', node: this.helicoCorp, name: 'helico_corps'})
    helicopter.add(this.helicoCorp)

    /* Add rigth turbine */

    this.turbineDroite = new THREE.Object3D();
    this.turbineDroite.position.set(8.5,-3,4) ;
    Loader.load({filename: 'assets/helico/turbine.obj', node: this.turbineDroite, name: 'turbine_droite'})
    helicopter.add(this.turbineDroite)

    /* Add right axeRotator */

    this.axeDroit = new THREE.Object3D();
    this.axeDroit.position.set(8.5,-2,4) ;
    Loader.load({filename: 'assets/helico/axe.obj', node: this.axeDroit, name: 'axe_droite'});
    helicopter.add(this.axeDroit)

    /* Add pales for rigth axeRotator */

    this.axeDroitPal1 = new THREE.Object3D()
    this.axeDroitPal1.position.set(8.5,0,4);
    Loader.load({filename: 'assets/helico/pale.obj', node: this.axeDroitPal1, name: 'axe_droite_pal_01'})
    helicopter.add(this.axeDroitPal1)
    this.axeDroitPal2 = new THREE.Object3D()
    this.axeDroitPal2.position.set(8.5,0,4);
    this.axeDroitPal2.rotation.y = - 2*Math.PI/3;
    Loader.load({filename: 'assets/helico/pale.obj', node: this.axeDroitPal2, name: 'axe_droite_pal_02'})
    helicopter.add(this.axeDroitPal2)
    this.axeDroitPal3 = new THREE.Object3D()
    this.axeDroitPal3.position.set(8.5,0,4);
    this.axeDroitPal3.rotation.y = 2*Math.PI/3;
    Loader.load({filename: 'assets/helico/pale.obj', node: this.axeDroitPal3, name: 'axe_droite_pal_03'})
    helicopter.add(this.axeDroitPal3)

    /* Add left turbine */

    this.turbineGauche = new THREE.Object3D();
    this.turbineGauche.position.set(-8.5,-3,4);
    Loader.load({filename: 'assets/helico/turbine.obj', node: this.turbineGauche, name: 'turbine_gauche'})
    helicopter.add(this.turbineGauche);


    /* Add left axeRotator */

    this.axeGauche = new THREE.Object3D();
    this.axeGauche.position.set(-8.5,-2,4);
    Loader.load({filename: 'assets/helico/axe.obj', node: this.axeGauche, name: 'axe_gauche'});
    helicopter.add(this.axeGauche);

    /* Add pales for left axeRotator */

    this.axeGauchePal1 = new THREE.Object3D()
    this.axeGauchePal1.position.set(-8.5,0,4);
    Loader.load({filename: 'assets/helico/pale.obj', node: this.axeGauchePal1, name: 'axe_gauche_pal_01'})
    helicopter.add(this.axeGauchePal1)
    this.axeGauchePal2 = new THREE.Object3D()
    this.axeGauchePal2.position.set(-8.5,0,4);
    this.axeGauchePal2.rotation.y = - 2*Math.PI/3;
    Loader.load({filename: 'assets/helico/pale.obj', node: this.axeGauchePal2, name: 'axe_gauche_pal_02'})
    helicopter.add(this.axeGauchePal2)
    this.axeGauchePal3 = new THREE.Object3D()
    this.axeGauchePal3.position.set(-8.5,0,4);
    this.axeGauchePal3.rotation.y = 2*Math.PI/3;
    Loader.load({filename: 'assets/helico/pale.obj', node: this.axeGauchePal3, name: 'axe_gauche_pal_03'})
    helicopter.add(this.axeGauchePal3)


   /*Add central turbine */

    this.turbineCentrale = new THREE.Object3D();
    this.turbineCentrale.position.set(0,0,4);
    this.turbineCentrale.rotation.x =  Math.PI/2;
    Loader.load({filename: 'assets/helico/turbine.obj', node: this.turbineCentrale, name: 'turbine_centrale'});
    helicopter.add(this.turbineCentrale);

    /* Add central axeRotator */

    this.axeCentrale = new THREE.Object3D();
    this.axeCentrale.position.set(0,0,5)
    this.axeCentrale.rotation.x = Math.PI/2;
    Loader.load({filename: 'assets/helico/axe.obj', node: this.axeCentrale, name: 'axe_centrale'})
    helicopter.add(this.axeCentrale);

    /*Add pales for central axeRotator */

    this.axeCentralPal1 = new THREE.Object3D()
    this.axeCentralPal1.position.set(0,0,7);
    this.axeCentralPal1.rotation.x = Math.PI/2;
    Loader.load({filename: 'assets/helico/pale.obj', node: this.axeCentralPal1, name: 'axe_central_pal_01'})
    helicopter.add(this.axeCentralPal1)
    this.axeCentralPal2 = new THREE.Object3D()
    this.axeCentralPal2.position.set(0,0,7);
    this.axeCentralPal2.rotation.x = Math.PI/2;
    this.axeCentralPal2.rotation.y = - 2*Math.PI/3;
    Loader.load({filename: 'assets/helico/pale.obj', node: this.axeCentralPal2, name: 'axe_central_pal_02'})
    helicopter.add(this.axeCentralPal2)
    this.axeCentralPal3 = new THREE.Object3D()
    this.axeCentralPal3.position.set(0,0,7);
    this.axeCentralPal3.rotation.x = Math.PI/2;
    this.axeCentralPal3.rotation.y = 2*Math.PI/3;
    Loader.load({filename: 'assets/helico/pale.obj', node: this.axeCentralPal3, name: 'axe_central_pal_03'})
    helicopter.add(this.axeCentralPal3)

    return helicopter;
  }

  /* Methods  */

  this.updatePalesSpeedRotation = function(force){
    helicopter.axeDroitPal1.rotation.y += force;
    helicopter.axeDroitPal2.rotation.y += force;
    helicopter.axeDroitPal3.rotation.y += force;
    helicopter.axeGauchePal1.rotation.y += force;
    helicopter.axeGauchePal2.rotation.y += force;
    helicopter.axeGauchePal3.rotation.y += force;
    helicopter.axeCentralPal1.rotation.y += force;
    helicopter.axeCentralPal2.rotation.y += force;
    helicopter.axeCentralPal3.rotation.y += force;
  }

  this.weight = function()
	{
		return this.mass * Physics.G ;
	} ;

	/**
	 *  Resets aplied forces and momentum
	 */
	this.reset = function()
	{
		this.momentum.set(0,0,0) ;
		this.force.set(0,0,0) ;
		this.turn = false ;
	} ;

  this.multiplyInverseInertia = function(momentum)
	{
		var a = this.mass*(this.yLength*this.yLength+this.zLength*this.zLength) ;
		var b = this.mass*(this.xLength*this.xLength+this.zLength*this.zLength) ;
		var c = this.mass*(this.xLength*this.xLength+this.yLength*this.yLength) ;
		return new THREE.Vector3(momentum.x/a, momentum.y/b, momentum.z/c) ;
	} ;


  /** Applies the helicopter rotations to the provided vector
	 *
	 */
	this.applyRotations = function(localVector)
	{
    var result = new THREE.Vector3(localVector.x, localVector.y, localVector.z)
		//var result = localVector.clone() ;
		result.applyEuler(new THREE.Euler(this.angles.x, this.angles.y, this.angles.z, 'XYZ')) ;
		return result ;
	} ;

  /**
	 *  Applies a force on the object
	 *  @param relativePosition {THREE.Vector3} The position (in local coordinates) of point on which the force
	 *  	   is applied
	 *  @param forceVector {THREE.Vector3} The force vector
	 */
	this.applyForce = function(relativePosition, forceVector)
	{
		var tmp = this.applyRotations(forceVector) ;
		this.force.add(tmp) ;
		var oriented = this.applyRotations(relativePosition) ;
		oriented.cross(tmp) ;
		this.momentum.add(oriented) ;
	} ;

  this.goUp = function(frontRight,frontLeft,rearRight,rearLeft)
	{
		this.applyForce(new THREE.Vector3(this.xLength/2, this.yLength/2, -this.zLength/2), new THREE.Vector3(0,0,frontRight)) ;
		this.applyForce(new THREE.Vector3(this.xLength/2, -this.yLength/2, -this.zLength/2), new THREE.Vector3(0,0,frontLeft)) ;
		this.applyForce(new THREE.Vector3(-this.xLength/2, this.yLength/2, -this.zLength/2), new THREE.Vector3(0,0,rearRight)) ;
		this.applyForce(new THREE.Vector3(-this.xLength/2, -this.yLength/2, -this.zLength/2), new THREE.Vector3(0,0,rearLeft)) ;
	} ;

	this.goFront = function(left, right)
	{
		this.applyForce(new THREE.Vector3(-this.xLength/2, this.yLength/2, 0.0), new THREE.Vector3(right,0,0)) ;
		this.applyForce(new THREE.Vector3(-this.xLength/2, -this.yLength/2, 0.0), new THREE.Vector3(left,0,0)) ;
	} ;

	this.brake = function(strength)
	{
		var force = strength*(this.speed.dot(this.frontDirection())) ;
		this.goFront(-force, -force) ;
	} ;

	this.turnLeft = function(force)
	{
		this.turn = true ;
		this.applyForce(new THREE.Vector3(-this.xLength/2, -this.yLength/2, 0.0), new THREE.Vector3(0,-force,0)) ;
		this.applyForce(new THREE.Vector3(this.xLength/2, this.yLength/2, 0.0), new THREE.Vector3(0,force,0)) ;
	} ;

	this.turnRight = function(force)
	{
		this.turn = true ;
		this.applyForce(new THREE.Vector3(this.xLength/2, -this.yLength/2, 0.0), new THREE.Vector3(0,-force,0)) ;
		this.applyForce(new THREE.Vector3(-this.xLength/2, this.yLength/2, 0.0), new THREE.Vector3(0,force,0)) ;
	} ;

	this.goRight = function(force)
	{
		this.applyForce(new THREE.Vector3(-this.xLength/2, -this.yLength/2, 0.0), new THREE.Vector3(0,-force,0)) ;
		this.applyForce(new THREE.Vector3(this.xLength/2, -this.yLength/2, 0.0), new THREE.Vector3(0,-force,0)) ;
	};

	this.goLeft = function(force)
	{
		this.applyForce(new THREE.Vector3(-this.xLength/2, this.yLength/2, 0.0), new THREE.Vector3(0,force,0)) ;
		this.applyForce(new THREE.Vector3(this.xLength/2, this.yLength/2, 0.0), new THREE.Vector3(0,force,0)) ;
	};

	this.frontDirection = function()
	{
		return this.applyRotations(new THREE.Vector3(1.0,0.0,0.0)) ;
	} ;

	this.rightDirection = function()
	{
		return this.applyRotations(new THREE.Vector3(0.0,1.0,0.0)) ;
	} ;

	this.upDirection = function()
	{
		return this.applyRotations(new THREE.Vector3(0.0,0.0,1.0)) ;
	} ;

	this.stabilizeSkid = function(factor)
	{
		// Stabilization (stops the skid)
		var dot = this.speed.dot(this.rightDirection());
		this.goRight(factor*dot) ; // 1000.0
	} ;

	this.stabilizeTurn = function(factor)
	{
		if(!this.turn)
		{
			this.turnRight(factor*this.angularSpeed.z) ; // 1000.0
		}
	} ;

	this.stopAngularSpeedsXY = function()
	{
		this.angularSpeed.x=0.0 ;
		this.angularSpeed.y=0.0 ;
	} ;

	/** Updates the vehicle based on provided forces.
	 *
	 */
	this.update = function(dt)
	{
		// Forces stabilization around X and Y. (due to some identified instabilities).
		// Adds gravity
		this.force.add(new THREE.Vector3(0,0,-this.weight())) ;
		// Orientation
		var angularAcceleration = this.multiplyInverseInertia(this.momentum) ;
		angularAcceleration.multiplyScalar(dt) ;
		this.angularSpeed.add(angularAcceleration) ;
		var angularSpeed = this.angularSpeed.clone() ;
		angularSpeed.multiplyScalar(dt) ;
		this.angles.add(angularSpeed) ;
		// Position and speed
		result = Physics.eulerIntegration(this.mass, dt, this.position, this.speed, this.force) ;
		this.position = result.position ;
		this.speed = result.speed ;
		// Resets everything
		this.reset() ;
	} ;







  /* Return the 3D object which embeded all parts */

  //return this.helicopter
}
