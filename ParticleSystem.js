// Tests the existence of ModuleLoader, if not, this file cannot be included
if(typeof(ModulesLoader)=="undefined")
{
	throw "ModulesLoader.js is required to load script ThreeRenderer.js" ;
}

// Loads dependencies and initializes this module
ModulesLoader.requireModules(['threejs/three.min.js', 'Physics.js', 'myJS/ThreeRenderingEnv.js', 'MathExt.js', 'DebugHelper.js']) ;

var ParticleSystem = {} ;

///////////////////////////
// Particles description //
///////////////////////////

/**
 *  The particle class
 */
ParticleSystem.PhysicsParticle_Class = function(position, speed, mass, size, lifeTime)
{
	/**
	 * Absolute position of the particle
	 */
	this.position = position.clone() ;
	/**
	 * Speed of the particle
	 */
	this.speed = speed.clone() ;

	/**
	 *  Force applied on the particle
	 */
	this.force = new THREE.Vector3(0.0,0.0,0.0) ;

	/**
	 *  Color of the particle
	 */
	this.color = new THREE.Color() ;
	this.color.setRGB(1.0,1.0,1.0) ;

	/**
	 *  Opacity of the particle
	 */
	this.opacity = 0.1 ;

	/**
	 *  1.0 : particle is rendered, 0.0 : particle is not rendered
	 */
	this.alive = 1.0 ;

	/**
	 *  Size of the particle
	 */
	this.size = size ;

	/**
	 *  Angle of the particle
	 */
	this.angle = 0.0 ;

	/**
	 * Life time (in seconds) of the particle
	 */
	this.lifeTime = lifeTime ;

	/**
	 * Current life time
	 */
	this.currentLifeTime = 0.0 ;

	/**
	 * Mass of the particle
	 */
	this.mass = mass ;

	/**
	 * Force associated to weight (on earth)
	 */
	this.weightForce = function()
	{
		return new THREE.Vector3(0.0,0.0,-this.mass * Physics.G)   ;
	} ;

	/**
	 *  Resets the force vector
	 */
	this.resetForce = function()
	{
		this.force.x = 0 ;
		this.force.y = 0 ;
		this.force.z = 0 ;
	} ;

	/**
	 * Call this function to know if the particle is dead or not.
	 */
	this.isDead = function()
	{
		return this.currentLifeTime >= this.lifeTime ;
	} ;
} ;

/////////////////////////
// Emitters description //
/////////////////////////

/** A class emitting particles in a cone. The configuration provided
 *  to the constructor must have the following structure:
{
	// Description of the emitter shape
	cone: {
		center: {THREE.Vector3} Cone center
		height: {THREE.Vector3} Cone height vector
		radius: {Scalar} Radius of the top of the cone
		flow: 	{Scalar} Number of particles emitted per second
	},
	// Description of the particles characteristics
	particle: {
		speed: 	  {MathExt.Interval_Class} Particle speed
		mass: 	  {MathExt.Interval_Class} Particle mass
		size:	  {MathExt.Interval_Class} Particle size
		lifeTime: {MathExt.Interval_Class} Particle lifetime
	}
}
*/
ParticleSystem.ConeEmitter_Class = function(configuration)
	//function(centerPosition, emissionDirection, radius, flow, speedInterval, massInterval, sizeInterval, lifeTimeInterval)
{
	// Tests requirements on configuration data structure
	DebugHelper.requireAttribute(configuration, 'cone') &&
		DebugHelper.requireAttribute(configuration.cone, 'center') &&
		DebugHelper.requireAttribute(configuration.cone, 'height') &&
		DebugHelper.requireAttribute(configuration.cone, 'radius') &&
		DebugHelper.requireAttribute(configuration.cone, 'flow') ;
	DebugHelper.requireAttribute(configuration, 'particle') &&
		DebugHelper.requireAttribute(configuration.particle, 'speed') &&
		MathExt.Interval_Class_Requirements(configuration.particle.speed) &&
		DebugHelper.requireAttribute(configuration.particle, 'mass') &&
		MathExt.Interval_Class_Requirements(configuration.particle.mass) &&
		DebugHelper.requireAttribute(configuration.particle, 'size') &&
		MathExt.Interval_Class_Requirements(configuration.particle.size) &&
		DebugHelper.requireAttribute(configuration.particle, 'lifeTime') &&
		MathExt.Interval_Class_Requirements(configuration.particle.lifeTime) ;

	/**
	 *  Emission direction
	 */
	this.direction = configuration.cone.height ;
	//	this.direction = emissionDirection ;
	this.direction.normalize() ;
	/**
	 *  Normal to the emission direction
	 */
	this.directionNormal = new THREE.Vector3(this.direction.z, this.direction.x, this.direction.y) ;
	this.directionNormal.cross(this.direction) ;
	this.directionNormal.normalize() ;
	/**
	 *  Emission center
	 */
	this.center = configuration.cone.center ;

	/**
	 *  Particles life time interval
	 */
	this.lifeTimeInterval = configuration.particle.lifeTime ;
//	this.lifeTimeInterval = lifeTimeInterval ;

	/**
	 *  Radius of the circle used to compute real emission direction
	 */
	this.spread = configuration.cone.radius/configuration.cone.height.lengthSq() ;
//	this.spread = radius/emissionDirection.lengthSq() ;
	/**
	 *  Speed interval
	 */
	this.speedInterval = configuration.particle.speed ;
//	this.speedInterval = speedInterval ;
	/**
	 *  Size interval
	 */
	this.sizeInterval = configuration.particle.size ;
//	this.sizeInterval = sizeInterval ;
	/**
	 *  The mass interval
	 */
	this.massInterval = configuration.particle.mass ;
//	this.massInterval = massInterval ;
	/**
	 *  Time elapsed since the emitter has been created
	 */
	this.currentDate = 0 ;
	/**
	 *  Last particle emission date
	 */
	this.lastDate = 0 ;
	/**
	 *  Number of particles emitted per second
	 */
	this.flow = configuration.cone.flow ;
//	this.flow = flow ;
	/**
	 *  Number of particles emitted since the creation of this emitter
	 */
	this.emitted = 0 ;

	/**
	 *  Instanciate a particle
	 *
	 *  @param position The initial particle position
	 *  @param speed The initial particle speed
	 *  @param mass Mass of the particle
	 *  @param lifeTime life time of the particle
	 */
	this.instantiateParticle = function(position, speed, mass, size, lifeTime)
	{
		return new ParticleSystem.PhysicsParticle_Class(position, speed, mass, size, lifeTime) ;
	} ;

	/**
	 * @return {position, speed} in which position and speed are instances of THREE.Vector3
	 */
	this.createParticle = function()
	{
		var mass = 0.1 ;
		var initialPosition = this.center.clone() ;
		var initialSpeed = this.direction.clone() ;
		var modifier = this.directionNormal.clone() ;
		modifier.applyAxisAngle(this.direction, Math.PI*2.0*Math.random()) ;
		modifier.multiplyScalar(this.spread*Math.sqrt(Math.random())) ;
		initialSpeed.add(modifier) ;
		initialSpeed.normalize() ;
		//initialSpeed.multiplyScalar(Math.random()*(this.speedInterval.max-this.speedInterval.min)+this.speedInterval.min) ;
		initialSpeed.multiplyScalar(this.speedInterval.random()) ;
		return this.instantiateParticle(initialPosition, initialSpeed, mass, this.sizeInterval.random(), this.lifeTimeInterval.random()) ;
	} ;

	/** Given the particle flow, creates necessary particles.
	 *
	 * @param dt Time elapsed since last call
	 * @return An array of emitted particles. Each particle is a structure {position, speed}
	 */
	this.createParticles = function(dt)
	{
		this.currentDate = this.currentDate + dt ;
		var maxEmitted = Math.round(this.currentDate * this.flow) ;
		var toEmit = maxEmitted - this.emitted ;
		var particles = [] ;
		for(cpt=0 ; cpt<toEmit ; cpt++)
		{
			particles.push(this.createParticle()) ;
			this.emitted++ ;
		}
		return particles ;
	} ;
} ;

/////////////////////////
// Available modifiers //
/////////////////////////

/**
 *  Modifies the current life time given the dt
 */
ParticleSystem.LifeTimeModifier_Class = function()
{
	this.apply = function(particle, dt)
	{
		particle.currentLifeTime = particle.currentLifeTime + dt ;
	} ;
} ;

/**
 *  Modifies the position of the particle using euler integration
 */
ParticleSystem.PositionModifier_EulerItegration_Class = function()
{
	this.apply = function(particle,dt)
	{
		var result = Physics.eulerIntegration(particle.mass, dt, particle.position, particle.speed, particle.force) ;
		particle.position = result.position ;
		particle.speed = result.speed ;
	} ;
} ;

/**
 *  Limits the particle to a position contained by the half world designated by the plane
 */
ParticleSystem.PositionModifier_PlaneLimit_Class = function(point, normal)
{
	this.plane = new THREE.Plane() ;
	this.plane.setFromNormalAndCoplanarPoint(normal, point) ;

	this.apply = function(particle, dt)
	{
		distance = this.plane.distanceToPoint(particle.position) ;
		if(distance<0.0)
		{
			//particle.speed = new THREE.Vector3(0.0,0.0,0.0) ;
			particle.position = this.plane.projectPoint(particle.position) ;
		}
	} ;
} ;

/**
 * 	Describes a wall on which a particle bounces.
 */
ParticleSystem.PositionModifier_PlaneBounce_Class = function(point, normal, attenuation)
{
	this.plane = new THREE.Plane() ;
	this.normal = normal ;
	this.attenuation = attenuation ;
	this.normal.normalize() ;
	this.plane.setFromNormalAndCoplanarPoint(normal, point) ;

	this.apply = function(particle, dt)
	{
		distance = this.plane.distanceToPoint(particle.position) ;
		if(distance<0.0)
		{
			if(particle.speed.dot(this.normal)<0.0)
			{
				var normalClone = this.normal.clone() ;
				normalClone.multiplyScalar(-2.0*this.normal.dot(particle.speed)) ;
				//console.log(this.normal.dot(particle.speed)) ;
				normalClone.add(particle.speed);
				normalClone.multiplyScalar(this.attenuation) ;
				particle.speed = normalClone ;
			}
			particle.position = this.plane.projectPoint(particle.position) ;
		}
	} ;
} ;

/** Resets forces associated to particles
 *
 * @returns {ForceModifier_ResetForce_Class}
 */
ParticleSystem.ForceModifier_ResetForce_Class = function()
{
	this.apply = function(particle, dt)
	{
		particle.resetForce() ;
	} ;
} ;

/** An attractor class generating forces attracting particles toward a point.
 *
 * @param center The center of the attractor
 * @param extent The spatial extent of the attractor (particles farther from this distance will not be impacted by the attractor)
 * @param strength The force strength
 * @returns {Attractor_Class}
 */
ParticleSystem.ForceModifier_Attractor_Class = function(center, extent, strength)
{
	this.center = center ;
	this.extent = extent ;
	this.strength = strength ;

	this.apply = function(particle, dt)
	{
		var distance = center.distanceTo(particle.position) ;
		if(distance<=extent)
		{
			var force = MathExt.subVectors(center, particle.position) ;
			force.normalize() ;
			force.multiplyScalar(strength*(1.0-distance/extent)) ;
			particle.force.add(force) ;
		}
	} ;
} ;

/** An attractor class generating forces attracting particles toward a segment.
 *
 * @param segment {THREE.Line3} The segment of the attractor
 * @param extent The spatial extent of the attractor (particles farther from this distance will not be impacted by the attractor)
 * @param strength The force strength
 * @returns {Attractor_Class}
 */
ParticleSystem.ForceModifier_AttractorSegment_Class = function(segment, extent, strength)
{
	this.segment = segment ;
	this.extent = extent ;
	this.strength = strength ;

	this.apply = function(particle, dt)
	{
		var center = segment.closestPointToPoint(particle.position) ;
		var distance = center.distanceTo(particle.position) ;
		if(distance<=extent)
		{
			var force = MathExt.subVectors(center, particle.position) ;
			force.normalize() ;
			force.multiplyScalar(strength*(1.0-distance/extent)) ;
			particle.force.add(force) ;
		}
	} ;
} ;

/** A repeller class repelling particles from a point
 *
 * @param center The center of the repeller
 * @param extent The spatial extent of the repeller (particles farther from this distance will not be impacted by the repeller)
 * @param strength The force strength
 */
ParticleSystem.ForceModifier_Repeller_Class = function(center, extent, strength)
{
	ParticleSystem.ForceModifier_Attractor_Class.call(this, center, extent, -strength) ;
} ;

/** A repeller class repelling particles from a segment
 *
 * @param segment The segment of the repeller
 * @param extent The spatial extent of the repeller (particles farther from this distance will not be impacted by the repeller)
 * @param strength The force strength
 */
ParticleSystem.ForceModifier_RepellerSegment_Class = function(segment, extent, strength)
{
	ParticleSystem.ForceModifier_AttractorSegment_Class.call(this, segment, extent, -strength) ;
} ;

/** A weight force class
 *
 * @returns {ForceModifier_Weight_Class}
 */
ParticleSystem.ForceModifier_Weight_Class = function()
{
	this.apply = function(particle, dt)
	{
		particle.force.add(new THREE.Vector3(0.0,0.0,-particle.mass * Physics.G)) ;
	} ;
} ;

/** Sets the particle opacity based on the ratio of its lifetime
 *
 * @param interpolator {Interpolator_xxx_Class} An opacity interpolator
 *
 * @returns {OpactyModifier_TimeToDeath_Class}
 */
ParticleSystem.OpacityModifier_TimeToDeath_Class = function(interpolator)
{
	Interpolators.Class_Requirements(interpolator) ;
	this.interpolator = interpolator ;

	this.apply = function(particle, dt)
	{
		var ratio = particle.currentLifeTime/particle.lifeTime ;
		particle.opacity = interpolator.value(ratio) ;
	} ;
} ;

/** Sets the particle size given its life time ratio, an initial size and a final size
 *
 * @param interpolator {Interpolators.XXX_Class} A size interpolator
 * @returns {SizeModifier_TimeToDeath_Class}
 */
ParticleSystem.SizeModifier_TimeToDeath_Class = function(interpolator)
{
	Interpolators.Class_Requirements(interpolator) ;
	this.interpolato = interpolator ;

	this.apply = function(particle, dt)
	{
		var ratio = particle.currentLifeTime/particle.lifeTime ;
		particle.size = interpolator.value(ratio) ;
	} ;
} ;

/** Sets the particle size given its life time ratio, and factors applied on the
 *  initial size of the particle.
 *
 * @param startFactor Factor applied on the initial size of the particle in order to compute the current size
 * @param endFactor Factor applied on the initial size of the particle in order to compute the current size.
 * @returns {SizeModifier_TimeToDeath_Class}
 */
ParticleSystem.SizeModifier_TimeToDeathFactor_Class = function(interpolator)
{
	Interpolators.Class_Requirements(interpolator) ;
	this.interpolator = interpolator ;

	this.apply = function(particle, dt)
	{
		if(!particle.hasOwnProperty('__initialSize'))
		{
			particle.__initialSize = particle.size ;
		}
		var ratio = particle.currentLifeTime/particle.lifeTime ;
		particle.size = interpolator.value(ratio)*particle.__initialSize ;
	} ;
} ;

/** Sets the color of the particle given its life time ratio
 *
 * @param startColor
 * @param endColor
 * @returns {ColorModifier_TimeToDeath_Class}
 */
ParticleSystem.ColorModifier_TimeToDeath_Class = function(startColor, endColor)
{
	this.startColor = startColor ;
	this.endColor = endColor ;

	this.apply = function(particle, dt)
	{
		var ratio = particle.currentLifeTime/particle.lifeTime ;
		particle.color.r = (1.0-ratio)*this.startColor.r+ratio*this.endColor.r ;
		particle.color.g = (1.0-ratio)*this.startColor.g+ratio*this.endColor.g ;
		particle.color.b = (1.0-ratio)*this.startColor.b+ratio*this.endColor.b ;
	} ;
} ;

/** A constant speed field generating a steering force
 *
 */
ParticleSystem.ForceModifier_SteeringUniformSpeed_Class = function(speedVector, maxForce)
{
	this.speedVector = speedVector ;
	this.maxForce = maxForce ;

	this.apply = function(particle, dt)
	{
		var steeringForce = MathExt.subVectors(speedVector, particle.speed) ;
		if(steeringForce.lengthSq()>this.maxForce)
		{
			steeringForce.normalize() ;
			steeringForce.multiplyScalar(maxForce) ;
		}
		particle.force.add(steeringForce) ;
	} ;
} ;

/** Construction of a particle system instance. This class is an animator
 *  compatible with the ThreeRenderer class and is an animator .
 *
 *  configuration: data structure containing the following attributes
 *  	- particlesCount : maximum number of particles
 *  	- textureFile : filename of the texture associated to particle for rendering
 *      - blendingMode : THREE blending mode (THREE.AdditiveBlending, THREE.NormalBlending...)
 *  For rendering, the attribute 'particleSystem' must be added in the THREEJS scene graph
 *
 * @returns {ParticleSystem_Class}
 */
ParticleSystem.Engine_Class = function(configuration)
{
	// Creates the configuration and adds default values to the configuration is needed
	if(!configuration)
	{
		configuration = {} ;
	}
	if(!configuration.hasOwnProperty('textureFile'))
	{
		console.warn('ParticleSystem_Class: added textureFile attribute') ;
		configuration.textureFile = 'models/particles/particle.png' ;
	}
	if(!configuration.hasOwnProperty('particlesCount'))
	{
		console.warn('ParticleSystem_Class: added particlesCount attribute, set to 2000') ;
		configuration.particlesCount = 2000 ;
	}
	if(!configuration.hasOwnProperty('blendingMode'))
	{
		console.warn('ParticleSystem_Class: added blendingMode attribute, set to THREE.AdditiveBlending') ;
		configuration.blendingMode = THREE.AdditiveBlending ;
	}

	/////////////
	//SHADERS //
	/////////////

	//attribute: data that may be different for each particle (such as size and color);
	//can only be used in vertex shader
	//varying: used to communicate data from vertex shader to fragment shader
	//uniform: data that is the same for each particle (such as texture)
	particleVertexShader =
		[
			"attribute vec3 customColor;",
			"attribute float customOpacity;",
			"attribute float customSize;",
			"attribute float customAngle;",
			"attribute float customVisible;", // float used as boolean (0 = false, 1 = true)
			"varying vec4 vColor;",
			"varying float vAngle;",
			"void main()",
			"{",
				"if ( customVisible > 0.5 )", // true
					"vColor = vec4( customColor, customOpacity );", // set color associated to vertex; use later in fragment shader.
				"else", // false
					"vColor = vec4(0.0, 0.0, 0.0, 0.0);", // make particle invisible.
				"vAngle = customAngle;",
				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
				"gl_PointSize = customSize * ( 300.0 / length( mvPosition.xyz ) );", // scale particles as objects in 3D space
				"gl_Position = projectionMatrix * mvPosition;",
			"}"
	].join("\n");

	particleFragmentShader =
		[
			"uniform sampler2D texture;",
			"varying vec4 vColor;",
			"varying float vAngle;",
			"void main()",
			"{",
				"gl_FragColor = vColor;",
				"float c = cos(vAngle);",
				"float s = sin(vAngle);",
				"vec2 rotatedUV = vec2(c * (gl_PointCoord.x - 0.5) + s * (gl_PointCoord.y - 0.5) + 0.5,",
				"c * (gl_PointCoord.y - 0.5) - s * (gl_PointCoord.x - 0.5) + 0.5);", // rotate UV coordinates to rotate texture
				"vec4 rotatedTexture = texture2D( texture, rotatedUV );",
				"gl_FragColor = gl_FragColor * rotatedTexture;", // sets an otherwise white particle texture to desired color
			"}"
	].join("\n");

	////////////////////////////////////////
	// Attributes of ParticleSystem_Class //
	////////////////////////////////////////

	/**
	 * Number of particles
	 */
	this.particlesCount = configuration.particlesCount ;

	/**
	 * Geometry associated to the particle system
	 */
	this.particlesGeometry = new THREE.Geometry() ;

	/**
	 *  Vertex array associated to particles
	 */
	this.particlesVertices = this.particlesGeometry.vertices ;

	/**
	 *  Texture file associated to particles
	 */
	this.particleTextureFile = configuration.textureFile ;

	/**
	 *  Blending mode used during rendering
	 */
	this.blendingMode = configuration.blendingMode ;

	/**
	 * Material associated to the particle system
	 */
	this.particlesMaterial = new THREE.ShaderMaterial(
			{
				uniforms:
				{
					texture: { type: "t",
							   value: THREE.ImageUtils.loadTexture( this.particleTextureFile, undefined,
									   								function(){},
									   								function() { console.error('ParticleSystem_Class: could not load texture '+this.particleTextureFile) ; } )
							 }
				},
				attributes:
				{
					customVisible:	{ type: 'f', value: [] },
					customAngle:	{ type: 'f', value: [] },
					customSize:	{ type: 'f', value: [] },
					customColor:	{ type: 'c', value: [] },
					customOpacity:	{ type: 'f', value: [] }
				},
				vertexShader: particleVertexShader,
				fragmentShader: particleFragmentShader,
				transparent: true,
				//alphaTest: 0.5, // if having transparency issues, try including: alphaTest: 0.5,
				blending: this.blendingMode,
//				blending: THREE.AdditiveBlending,
//				blending: THREE.NormalBlending,
				depthTest: true
			}
	);

	// Initializes the particle system by adding vertices with (0.0,0.0,0.0) coordinates;
	for(cpt=0 ; cpt<this.particlesCount ; cpt++)
	{
		this.particlesGeometry.vertices.push(new THREE.Vector3(0.0,0.0,0.0)) ;
		this.particlesMaterial.attributes.customVisible.value[cpt] = 0.0 ;
		this.particlesMaterial.attributes.customColor.value[cpt] = new THREE.Color().setRGB(0.0,0.0,0.0);
		this.particlesMaterial.attributes.customOpacity.value[cpt] = 1.0 ;
		this.particlesMaterial.attributes.customSize.value[cpt] = 1.0 ;
		this.particlesMaterial.attributes.customAngle.value[cpt] = 0.0 ;
	}

	/**
	 *   The particle emitters
	 */
	this.emitters = [] ;

	/**
	 *   Alive particles
	 */
	this.particles = [] ;

	/**
	 * 	Force modifiers applied on particles. The default behaviour is to reset forces applied on particles.
	 */
	this.modifiers = [new ParticleSystem.ForceModifier_ResetForce_Class()] ;

	/**
	 * Instance of THREEJS particle system
	 */
	this.particleSystem = new THREE.PointCloud(this.particlesGeometry, this.particlesMaterial);
	// Activates particles sorting
	this.particleSystem.sortParticles = true;

	/////////////////////
	// private Methods //
	/////////////////////

	/**
	 *  Iterates on particles and call toApply function with the particle provided as a parameter
	 */
	this.iterateParticles = function(forceModifier, dt)
	{
		for(var cpt=0 ; cpt<this.particles.length ; cpt++)
		{
			forceModifier.apply(this.particles[cpt], dt) ;
		}
	} ;

	/**
	 *  Applies all forces on the referenced particles
	 */
	this.applyModifiers = function(dt)
	{
		for(cpt=0 ; cpt<this.modifiers.length ; cpt++)
		{
			this.iterateParticles(this.modifiers[cpt], dt) ;
		}
	} ;

	/**
	 *  Handles life an death of the the particles
	 *
	 *  @param dt Time elpased since last call
	 */
	this.lifeAndDeath = function(dt)
	{
		// We remove dead particles
		var cpt = 0 ;
//		var removed = 0 ;
//		var added = 0 ;
		while(cpt<this.particles.length)
		{
			if(this.particles[cpt].isDead())
			{
				this.particles[cpt] = this.particles[this.particles.length-1] ;
				this.particles.pop() ;
//				removed++ ;
			}
			else
			{
				cpt++ ;
			}
		}
		// We add the emitted particles
		for(cptEmit=0 ; cptEmit<this.emitters.length ; cptEmit++)
		{
			var result = this.emitters[cptEmit].createParticles(dt) ;
			for(cpt=0 ; cpt<result.length ; cpt++)
			{
				this.particles.push(result[cpt]) ;
//				added++ ;
			}
		}
//		console.log('alive particles: '+this.particles.length+', removed: '+removed+', added: '+added) ;
	} ;

	/**
	 *  Updates the buffer associated to rendering
	 */
	this.updateBuffers = function()
	{
		for(cpt=0 ; cpt<this.particles.length && cpt<this.particlesVertices.length ; ++cpt)
		{
			this.particlesVertices[cpt]=(this.particles[cpt].position) ;
			this.particlesMaterial.attributes.customVisible.value[cpt] = 1.0 ;
			this.particlesMaterial.attributes.customColor.value[cpt] = this.particles[cpt].color;
			this.particlesMaterial.attributes.customOpacity.value[cpt] = this.particles[cpt].opacity ; //0.01 ;//this.particles[cpt].opacity;
			this.particlesMaterial.attributes.customSize.value[cpt] = this.particles[cpt].size;
			this.particlesMaterial.attributes.customAngle.value[cpt] = this.particles[cpt].angle;
		}
		for( ; cpt<this.particlesVertices.length ; cpt++)
		{
			var position = this.particlesVertices[cpt] ;
			position.x = 0.0 ;
			position.y = 0.0 ;
			position.z = 0.0 ;
			this.particlesMaterial.attributes.customVisible.value[cpt] = 0.0 ; // We hide the particle
		}
		this.particlesGeometry.verticesNeedUpdate = true ;
	} ;

	////////////////////
	// Public methods //
	////////////////////

	/**
	 * Animates the particle system. This animate function is compatible
	 * with the animators handled by the ThreeRenderer class.
	 *
	 * @param dt Time elapsed since last call
	 * @param threeRenderer The instance of ThreeRenderer_Class calling this method
	 */
	this.animate = function(dt, threeRenderer)
	{
		// Handles life and death of particles
		this.lifeAndDeath(dt) ;
		// Applies forces on the particles
		this.applyModifiers(dt) ;
		// Computes particles animation
//		for(cpt=0 ; cpt<this.particles.length ; ++cpt)
//		{
//			this.particles[cpt].animate(dt) ;
//		}
		// Updates rendering
		this.updateBuffers() ;
		// Outputs warning needed
		if(this.particles.length > this.particlesVertices.length)
		{
			console.warn('number of alive particles is greater than the number of rendered particles') ;
		}
	} ;

	/**
	 *  Adds an emitter in the particle system
	 *  An emitter must implement method createParticles(dt).
	 */
	this.addEmitter = function(emitter)
	{
		DebugHelper.requireMethod(emitter, 'createParticles', 'ParticleSystem.Engine.addEmitter, missing method createParticle(dt)') ;
		this.emitters.push(emitter) ;
	} ;

	/**
	 *  Adds a modifier in the particle system
	 *  A modifier must implement method apply(particle,dt)
	 */
	this.addModifier = function(modifier)
	{
		DebugHelper.requireMethod(modifier, 'apply', 'ParticleSystem.Engine.addModifier, missing method apply(dt)') ;
		this.modifiers.push(modifier) ;
	} ;
} ;
