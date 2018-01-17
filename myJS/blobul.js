function blobul(phongLambert,col){
	// lod
	var lod = 32 ;
	var mat ;
	switch(phongLambert){
		case 'phong' :
			mat = new THREE.MeshPhongMaterial( col );
			break ;
		case 'lambert':
			mat = new THREE.MeshLambertMaterial(col);
			break;
	}
	// sphere 0
	var sphere0 = new THREE.Mesh( new THREE.SphereGeometry( 10, lod, lod ), mat); 
	// spherePX
	var spherePX = new THREE.Mesh( new THREE.SphereGeometry( 7, lod, lod ), mat	); 
	spherePX.position.x = 5 ;
	// sphereNX
	var sphereNX = new THREE.Mesh( new THREE.SphereGeometry( 7, lod, lod ),mat	); 
	sphereNX.position.x = -5 ;
	// spherePY
	var spherePY = new THREE.Mesh(new THREE.SphereGeometry( 7, lod, lod ), mat); 
	spherePY.position.y = 5 ;
	// sphereNY
	var sphereNY = new THREE.Mesh( 
		new THREE.SphereGeometry( 7, lod, lod ),mat); 
	sphereNY.position.y = -5 ;
	// spherePZ
	var spherePZ = new THREE.Mesh(new THREE.SphereGeometry( 7, lod, lod ), mat); 
	spherePZ.position.z = 5 ;
	// sphereNZ
	var sphereNZ = new THREE.Mesh( new THREE.SphereGeometry( 7, lod, lod ), mat); 
	sphereNZ.position.z = -5 ;
	// shadows
	sphere0.castShadow = true;	sphere0.receiveShadow  = false;
	spherePX.castShadow = true;	spherePX.receiveShadow  = false;
	sphereNX.castShadow = true;	sphereNX.receiveShadow  = false;
	spherePY.castShadow = true;	spherePY.receiveShadow  = false;
	spherePY.castShadow = true;	spherePY.receiveShadow  = false;
	spherePZ.castShadow = true;	spherePZ.receiveShadow  = false;
	sphereNZ.castShadow = true;	sphereNZ.receiveShadow  = false;
	// add
	sphere0.add(spherePX);
	sphere0.add(sphereNX);
	sphere0.add(spherePY);
	sphere0.add(sphereNY);
	sphere0.add(spherePZ);
	sphere0.add(sphereNZ);
	//
	return sphere0 ;
}