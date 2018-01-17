// Navigation module
//----------------------------------------------------------------------------------------
// navPlane
//----------------------------------------------------------------------------------------
// aligned plane for navigation

// constructor
navPlane = function(nname,xxmin, xxmax,yymin,yymax){
	// attributes
	// --------------------------------------------------
	// plane name
	this.name = nname ;
	// size
	if(xxmin<=xxmax){
		this.xmin = xxmin ;
		this.xmax = xxmax ;
	}
	else{
		this.xmin = xxmax ;
		this.xmax = xxmin ;	
	}
	if (yymin<=yymax){
		this.ymin = yymin;
		this.ymax = yymax ;
	}
	else{
		this.ymin = yymax;
		this.ymax = yymin ;
	}

	// methods
	// --------------------------------------------------
	// isIn
	this.isIn = function ( x,y ) {
		return (this.xmin<=x)&&(x<=this.xmax)&&(this.ymin<=y)&&(y<=this.ymax);
	};
	// stayInX
	this.stayInX = function(x,y,tx,ty){
		var xt ;
		if (this.isIn(x+tx,y)) {xt = tx}else{xt=0} ;
		return xt
	}
	// stayInY
	this.stayInY = function(x,y,tx,ty){
		var yt ;
		if (this.isIn(x,y+ty)) {yt = ty}else{yt=0} ;
		return yt
	}

	// toMesh
	this.toMesh = function(){
		var geometry = new THREE.BoxGeometry( this.xmax-this.xmin,0.1, this.ymax-this.ymin ); 
		var material = new THREE.MeshBasicMaterial( {color: 0x404080} ); 
		var plane = new THREE.Mesh( geometry, material );
		plane.name = this.name +'GEO';
		plane.position.x = this.xmin + (this.xmax-this.xmin)/2.0; 
		plane.position.z = this.ymin + (this.ymax-this.ymin)/2.0;
		return plane;
	}
	// debug
	this.toString = function(){
		return 'plane('+this.name+'): [xmim:'+this.xmin+',xmax:'+this.xmax+' - ymin:'+this.ymin+',ymax:'+this.ymax+']';
	}
}

//----------------------------------------------------------------------------------------
// navPlaneSet
//----------------------------------------------------------------------------------------

//constructor
navPlaneSet = function(p){
	// attributes
	// --------------------------------------------------
	// array of ANavPlane
	this.planeSet = [];
	// must have one plane
	this.planeSet.push(p);	
	// active plane
	this.active = -1;
	// position x,y
	this.x = 0.0 ;
	this.y = 0.0 ;

	//methods
	// --------------------------------------------------
	// find active plane
	this.findActive = function (x,y){
		var act = -1;
		for (var i in this.planeSet){
			// console.log('testing plane :'+this.planeSet[i].name);
			// console.log('['+x+','+y+']:'+this.planeSet[i].toString());
			if((this.planeSet[i].isIn(x,y))){act =i; break;}			
		}
		//if (act == -1){console.log('out of the world !!!')}
		return act ;
	}
	// move
	this.move = function (dx,dy){
		// move in a plane
		// quick test of current active plane
		if (this.planeSet[this.active].isIn(this.x+dx, this.y+dy)){
			// stay in the same plane
			this.x += dx; this.y += dy;
		}
		else{
			// not in the same
			// console.log('leaving plane '+this.planeSet[this.active].name);
			var new_act = this.findActive(this.x+dx,this.y+dy);
			if (new_act==-1){
				// console.log('force to plane '+this.planeSet[this.active].name);
				// stay in
				var ddx = this.planeSet[this.active].stayInX(this.x, this.y,dx,dy);
				var ddy = this.planeSet[this.active].stayInY(this.x, this.y,dx,dy);
				this.x += ddx; this.y += ddy;
			}
			else {
				// move to another plane
				this.x += dx; this.y += dy;
				this.active = new_act ;
				// console.log('entering plane '+this.planeSet[this.active].name);
			}
		}	
	}
	// addPlane
	this.addPlane = function(p){this.planeSet.push(p);}
	// toMesh
	this.toMesh = function(){
		var o3d = new THREE.Object3D();
		o3d.name = 'nav_mesh';
		for(var i in this.planeSet){
			//console.log('navPlaneSet.toMesh:'+i);
			o3d.add(this.planeSet[i].toMesh());
		}
		return o3d ;
	}
	// debug
	this.debug = function(){
		console.log('Navigation Planes')
		console.log('------------------------------------------');
		console.log('active plane:'+this.active);
		console.log('position: [ x:'+this.x+', z:'+this.y+']');
		console.log('------------------------------------------');
		for (var i in this.planeSet){
			//console.log('navPlaneSet.debug:'+i);
			console.log(this.planeSet[i].toString());
		}
		console.log('------------------------------------------');
	}
	// init
	// active
	this.active = this.findActive(this.x,this.y);
}
