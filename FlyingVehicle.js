if(typeof(ModulesLoader)=="undefined")
{
	throw "ModulesLoaderV2.js is required to load script FlyingVehicle.js" ; 
}
// Loads dependencies and initializes this module
ModulesLoader.requireModules(['threejs/three.min.js', 'Physics.js', 'DebugHelper.js']) ;

/** A vehicule  
 * 
 * @param configuration
 * @returns {FlyingVehicle}
 */
function FlyingVehicle(configuration)
{
	if(!configuration.hasOwnProperty('position')) { configuration.position = new THREE.Vector3(0.0,0.0,0.0) ; }
	if(!configuration.hasOwnProperty('mass')) { configuration.mass = 50 ; }
	if(!configuration.hasOwnProperty('xLength')) { configuration.xLength = 5 ; }
	if(!configuration.hasOwnProperty('yLength')) { configuration.yLength = 2 ; }
	if(!configuration.hasOwnProperty('zLength')) { configuration.zLength = 2 ; }
	if(!configuration.hasOwnProperty('xAngle')) { configuration.xAngle = 0.0 ; }
	if(!configuration.hasOwnProperty('yAngle')) { configuration.yAngle = 0.0 ; }
	if(!configuration.hasOwnProperty('zAngle')) { configuration.zAngle = 0.0 ; }
	
	this.position = configuration.position ; //new THREE.Vector3(0.0,0.0,0.0) ;
	this.speed = new THREE.Vector3(0.0,0.0,0.0) ;
	this.mass = configuration.mass ; //50.0 ;
	
	this.angles = new THREE.Vector3(configuration.xAngle, configuration.yAngle, configuration.zAngle) ;
	this.angularSpeed = new THREE.Vector3(0.0,0.0,0.0) ;

	this.xLength = configuration.xLength ;
	this.yLength = configuration.yLength  ;
	this.zLength = configuration.zLength  ;
	
	this.force = new THREE.Vector3(0.0,0.0,0.0) ;
	this.momentum = new THREE.Vector3(0.0,0.0,0.0) ;
	
	this.turn = false ;
	
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
	
	/**
	 *  Multiplies the provided momentum by the inverse of the inertia matrix.
	 */
	this.multiplyInverseInertia = function(momentum)
	{
		var a = this.mass*(this.yLength*this.yLength+this.zLength*this.zLength) ;
		var b = this.mass*(this.xLength*this.xLength+this.zLength*this.zLength) ;
		var c = this.mass*(this.xLength*this.xLength+this.yLength*this.yLength) ;
		return new THREE.Vector3(momentum.x/a, momentum.y/b, momentum.z/c) ;
	} ;
	
	/** Applies the vehicle rotations to the provided vector
	 * 
	 */
	this.applyRotations = function(localVector)
	{
		var result = localVector.clone() ;
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
	
}