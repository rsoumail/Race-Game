DebugHelper = {} ;

/**
 *  Ensures that variable has a method named functionName
 *  
 *  @param variable: the tested variable
 *  @param functionName: {String} the name of the tested function
 *  @param errorMessage: {String} The error message written in the console
 */
DebugHelper.requireMethod = function(variable, functionName, errorMessage)
{
	var ok = variable.hasOwnProperty(functionName) && (variable[functionName] instanceof Function) ;
	DebugHelper.assert(ok, errorMessage) ;
	return ok ;
} ;

/**
 *  Ensures that variable has an attribute named attributeName
 *  
 *  @param variable: the tested variable
 *  @param attributeName: {String} the name of the tested attribute
 *  @param errorMessage: {String} The error message written in the console
 */
DebugHelper.requireAttribute = function(variable, attributeName, errorMessage)
{
	var ok = variable.hasOwnProperty(attributeName) ;
	DebugHelper.assert(ok, errorMessage) ;
	return ok ;
} ;

/**
 *  Ensures that a variable has aprovided attributes and methods
 *  
 *  @param variable: the tested variable
 *  @param attributesNames: {Array of string} the name of the tested attributes
 *  @param methodsNames: {Array of string} the name of the tested methods
 *  @param errorMessage: {String} The error message outputed in the console
 */
DebugHelper.requireAttributesAndMethods = function(variable, attributesNames, methodsNames, errorMessage)
{
	success = true ;
	for(cpt=0 ; cpt<attributesNames.length ; cpt++)
	{
		success = success && DebugHelper.requireAttribute(variable, attributesNames[cpt], "[" + attributesNames[cpt] + "]" + errorMessage) ;
	}
	for(cpt=0 ; cpt<methodsNames.length ; cpt++)
	{
		success = success && DebugHelper.requireAttribute(variable, methodsNames[cpt], "[" + methodsNames[cpt] + "]" + errorMessage) ;
	}
	return success ;
} ;

/**
 *  Classical assertion
 */
DebugHelper.assert = function(condition, errorMessage)
{
	if(!condition)
	{
		console.error(errorMessage) ;
	}
} ;