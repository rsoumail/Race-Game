// Tests the existence of ModuleLoader, if not, this file cannot be included
if(typeof(ModulesLoader)=="undefined")
{
	throw "ModulesLoader.js is required to load script ThreeRenderer.js" ; 
}
// Loads dependencies and initializes this module
ModulesLoader.requireModules(['DebugHelper.js']) ;

var Interpolators = {} ;

/** Tests if object interpolator has interpolators requirements, namely a value(parameter) method
 * 
 * @param interpolator Tested object
 */
Interpolators.Class_Requirements = function(interpolator)
{
	DebugHelper.requireMethod(interpolator, 'value', 'An interpolator must have a value(parameter) method') ;
} ;

/**
 *  Linear interpolation between two values
 */
Interpolators.Linear_Class = function(value0, value1)
{
	this.value0 = value0 ;
	this.value1 = value1 ;
	
	/** Returns the result of the interpolation
	 * 
	 *  @param parameter {Scalar} The inteprolation parameter in the interval [0,1]  
	 */
	this.value = function(parameter)
	{
		return (1.0-parameter)*this.value0 + parameter*this.value1 ;
	} ;
} ;

/**
 *  Linear interpolation with multiple values 
 *  
 *  @param values {Array of scalar} The list of values (uniformely distributed) used for interpolation.
 */
Interpolators.LinearUniform_Class = function(values)
{
	this.values = values ;
	
	/** Returns the result of the interpolation fir the given parameter  
	 * 
	 * @param parameter {Scalar} The interpolation parameter in [0;1]
	 */
	this.value = function(parameter)
	{
		var index = Math.floor(parameter*(this.values.length-1)) ;
		if(index>=this.values.length-1) { return this.values[this.values.length-1] ; }
		var localParameter = (parameter*(this.values.length-1)-index) ;
		return (1.0-localParameter)*this.values[index] + localParameter*this.values[index+1] ;
	} ;
} ;

/**
 *  A record used to describe interpolated values wth an associated parameter value
 */
Interpolators.Record_Class = function(parameter, value)
{
	/**
	 * The parameter value
	 */
	this.parameter = parameter ;
	/**
	 * The value associated to this parameter
	 */
	this.value = value ;
} ;

/** Linearly interpolates between records (see Interpolators.Record)
 * 
 *  @param parameters {Array} Contains the parameters.
 *  @param values {Array} Contains the values associated to the parameters. The siz eof this array must be equal to the size of parameters.
 */
Interpolators.LinearParameterValue_Class = function(parameters, values)
{
	/**
	 *  Array of parameters
	 */
	this.parameters = parameters ;
	/**
	 *  Array of values associated to the parameters
	 */
	this.values = values ;
	DebugHelper.assert(parameters.length == values.length, 'Interpolators.LinearTimeValue_Class: arrays of parameters and values must have the same size') ;
	DebugHelper.assert(parameters[0]==0.0, 'Interpolators.LinearTimeValue_Class: the value of the first parameter must be 0') ;
	DebugHelper.assert(parameters[parameters.size-1]==1.0, 'Interpolators.LinearTimeValue_Class: the value of the last parameter must be 1') ;
	
	/**
	 *  Finds the index of the highest parameter lower or equal to the provided one
	 */
	this.findPreviousIndex = function(parameter)
	{
		for(var cpt=0 ;  cpt<this.parameters.length ; ++cpt)
		{
			if(this.parameters[cpt]>parameter)
			{
				return cpt-1 ;
			}
		}
		return this.values.length-1 ;
	} ;
	
	/** Returns the result of the interpolation fir the given parameter  
	 * 
	 * @param parameter {Scalar} The interpolation parameter in [0;1]
	 */
	this.value = function(parameter)
	{
		var index = this.findPreviousIndex(parameter) ;
		if(index>=this.values.length-1)
		{
			return this.values[this.values.length-1].value ;
		}
		var localParameter = (parameter-this.parameters[index])/(this.parameters[index+1]-this.parameters[index]) ;
		return (1.0-localParameter)*this.values[index] + localParameter*this.values[index+1] ;
	} ;
} ;
