// grid
function grid(size,step) {
	// geometry
	var geometry = new THREE.Geometry();
	// material
	var material = new THREE.LineBasicMaterial( { color: 0x303030 } );
	// create grid
	for ( var i = - size; i <= size; i += step ) {
		geometry.vertices.push( new THREE.Vector3( - size, - 0.04, i ) );
		geometry.vertices.push( new THREE.Vector3(   size, - 0.04, i ) );
		geometry.vertices.push( new THREE.Vector3( i, - 0.04, - size ) );
		geometry.vertices.push( new THREE.Vector3( i, - 0.04,   size ) );
	}
	// object3D
	var line = new THREE.Line( geometry, material, THREE.LinePieces );
	return line;
}