/**
 *  Package containing useful extensions to mathematical functions.
 */

// Tests the existence of ModuleLoader, if not, this file cannot be included
if(typeof(ModulesLoader)=="undefined")
{
	throw "ModulesLoader.js is required to load script ThreeRenderer.js" ; 
}
// Loads dependencies and initializes this module
ModulesLoader.requireModules(['DebugHelper.js']) ;

var MathExt = {} ;

/**
 *  Tests if object tested has Interval_Class requirements in terms of attributes and methods
 */
 MathExt.Interval_Class_Requirements = function(tested)
 {
	return DebugHelper.requireAttributesAndMethods(tested,
												   ['min','max'],
											       ['inside', 'isIntersecting', 'random'],
											       "Provided instance does nbot match requirements of Interval_Class") ; 
} ;

/**
 * An interval class.
 */
MathExt.Interval_Class = function(min, max)
{
	/**
	 * Low bound
	 */
	this.min = min ;
	/**
	 * High bound
	 */
	this.max = max ;
	
	/**
	 * Length of the interval
	 */
	this.delta = function()
	{
		return max-min ;
	} ;

	this.inside = function(value)
	{
		return value<=this.max && value>=this.min ;
	} ;
	
	this.isIntersecting = function(interval)
	{
		return interval.inside(this.min) || interval.inside(this.max) || this.inside(interval.min) || this.inside(interval.max) ;
	} ;
	
	/**
	 * A random number included in the interval
	 */
	this.random = function()
	{
		return Math.random()*this.delta()+this.min ;
	} ;
} ;

MathExt.addVectors = function(vector1, vector2)
{
	return vector1.clone().add(vector2) ;
} ;

MathExt.subVectors = function(vector1, vector2)
{
	return vector1.clone().sub(vector2) ;
} ;


