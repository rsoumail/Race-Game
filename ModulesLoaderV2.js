/** Usage:
 * 
 * In the main application add a code similar to the following one:
	// Loads the ModulesLoader script
	requirejs(['ModulesLoader.js'], function()
			{
				// List of required modules
				myModulesLevel0 = ['module1.js', 'module2.js'] ;
				myModulesLevel1 = ['module2.js', 'module3.js'] ;
				// Adds the required modules (first loaded)
				ModuleLoader.requireModules(myModulesLevel0) ;
				// Adds the required modules (loaded after the previous ones)
				ModuleLoader.requireModules(myModulesLevel1) ;
				// Starts loading modules and calls main function once done.
				ModuleLoader.loadModules(main) ;
			} 
	) ;
  *
  * In the modules, add a code similar to the following one:
  *     
	// Tests the existence of ModuleLoader, if not, this file cannot be included
    if(typeof(ModulesLoader)=="undefined")
    {
    	throw "ModulesLoader.js is required to load this script" ; 
    }
  	// List of dependecies
	myDependenciesLevel0 = ['moduleA.js', 'moduleB.js'] ;
	myDependenciesLevel1 = ['moduleA.js', 'moduleB.js'] ;
	// Asks to load myDepenciesLevel0
	ModuleLoader.requireModules(myDependenciesLevel0) ;
	// Asks to load myDepenciesLevel1 after the previous ones and call the init function
	ModuleLoader.requireModules(myDependenciesLevel1, init) ;
  *
*/

/**
 *  The module loader instance
 */
var ModulesLoader = {} ;

// Nesting level (important)
ModulesLoader.nestingLevel = 0 ;
/** List of modules and callbacks.
 *  includes[k] contains a struture { includes: [], callbacks: []} in which 
 *  	- member includes is an array of array of filenames
 *  	- callbacks is an array of associated callback functions
 */
// List of modules and callbacks.
// includes[k] contains a struture { includes: [], callbacks: []} in which
// member includes is an array of array of filenames
// callbacks is an array of associated callback functions
ModulesLoader.includes = [] ;
	
/** Ask to load new modules
 * 
 * @param modules An array of string containing required modules filenames
 * @param callbackFunction A callback function called when modules are loaded
 */
ModulesLoader.requireModules = function(modules, callbackFunction)
{
	if(ModulesLoader.includes.length<=ModulesLoader.nestingLevel)
	{
		ModulesLoader.includes.push( {includes: [], callbacks: []} ) ;
	}
//	if(ModulesLoader.includes.length<=ModulesLoader.nestingLevel)
//	{
//		console.log('nesting level problem') ;
//	}	
	ModulesLoader.includes[ModulesLoader.nestingLevel].includes.push(modules) ;
	ModulesLoader.includes[ModulesLoader.nestingLevel].callbacks.push(callbackFunction) ;
} ;
	
/** Starts loading modules. ModulesLoader method MUST only be called in the main application
 * 
 * @param finalCallback The final callback (main application entry point)
 */
ModulesLoader.loadModules = function(finalCallback)
{
	function load()
	{
		// If no more included files are required, we call the final callback function
		if(ModulesLoader.includes.length==0)
		{
			finalCallback() ;
			return ;
		}
		ModulesLoader.nestingLevel = ModulesLoader.includes.length ;
		var lastElement = ModulesLoader.includes[ModulesLoader.includes.length-1] ;
		// Handles callbacks if necessary (it should be except for the first call)
		if(lastElement.includes.length<lastElement.callbacks.length)
		{
			if(lastElement.callbacks[0])
			{
				lastElement.callbacks[0]() ;
			}
			lastElement.callbacks.shift() ;
		}
		// Here lastElement.includes and lastElement.callbacks have the same number of elements
		if(lastElement.includes.length==0)
		{
			ModulesLoader.includes.pop() ;
			load() ;
			return ;
		}
		// There is files to include
		toInclude = lastElement.includes[0] ;
		lastElement.includes.shift() ;
		requirejs(toInclude, load) ;
	}		
	load() ;
} ;
