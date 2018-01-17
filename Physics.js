/**
 * 	Module containing useful functions for physics simulation 
 */

var Physics = {} ;

/**
 * 	Gravity constant on earth.
 */
Physics.G = 9,80665 ;

/** Function computing the Euler integration of mass x acceleration = sum of forces 
 * 
 * 	@param mass: [scalar] The object mass
 * 	@param dt: [scalar] The time step
 *  @param position: [THREE.Vector2 or THREE.Vector3 or THREE.Vector4] the current position of the object
 *  @param speed: [THREE.Vector2 or THREE.Vector3 or THREE.Vector4] the current speed of the object
 *  @param forces: [THREE.Vector2 or THREE.Vector3 or THREE.Vector4] the sum of the forces applied on the object
 *  @return { position, speed } where position and speed are the new position and speed at current time + dt
 */
Physics.eulerIntegration = function(mass, dt, position, speed, forces)
{
	var result = {} ;
	result.position = position.clone() ;
	result.speed = speed.clone() ;
	var copyForces = forces.clone() ;
	copyForces.multiplyScalar(dt/mass) ;
	result.speed.add(copyForces) ;
	var tmp = speed.clone() ;
	tmp.add(result.speed) ;
	tmp.multiplyScalar(dt/2.0) ;
	result.position.add(tmp) ;
	return result ;
} ;
