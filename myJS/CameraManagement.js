


CameraManagement = function(){

  var tour = 0;
  this.camerasPositions = [
    {
      camera: new THREE.Vector3(-260, -160, 100),
      positions: ['p01', 'p02', 'p03']
    },
    {
      camera: new THREE.Vector3(-240, 260, 100),
      positions: ['p04', 'p05', 'p06']
    },
    {
      camera: new THREE.Vector3(40, 260, 100),
      positions: ['p07','p08']
    },
    {
      camera: new THREE.Vector3(20, 60, 100),
      positions: ['p09', 'p11', 'p10']
    },
    {
      camera: new THREE.Vector3(240, 80, 100),
      positions: ['p12', 'p13','p14']
    },
    {
      camera: new THREE.Vector3(180, -80, 100),
      positions: ['p15', 'p16']
    },
    {
      camera: new THREE.Vector3(220, -220, 100),
      positions: ['p17', 'p18']
    },
    {
      camera: new THREE.Vector3(20, -180, 100),
      positions: ['p19', 'p20']
    },
    {
      camera: new THREE.Vector3(60, -40, 100),
      positions: ['p21', 'p22', 'p23']
    },
    {
      camera: new THREE.Vector3(-140, -100, 100),
      positions: ['p23','p24', 'p25']
    },
    {
      camera: new THREE.Vector3(-100, -240, 100),
      positions: ['p26', 'p27', 'p28']
    },
    {
      camera: new THREE.Vector3(-240, -240, 100),
      positions: ['p29', 'p30']
    }
  ]

  this.switchCamera = function(type, NAV, carPosition, carGeometry, renderingEnvironment){
    if(type){
      var active = NAV.findActive(carPosition.position.x, carPosition.position.y);
      var plane = NAV.planeSet[active];
      var newPosition
      this.camerasPositions.forEach((c) => {
        c.positions.forEach((p) => {
          if(plane.name === p){
            newPosition = c.camera
            return true
          }
        });
      });
      carGeometry.remove(renderingEnvironment.camera) ;
      renderingEnvironment.camera.position.x = newPosition.x
      renderingEnvironment.camera.position.y = newPosition.y
      renderingEnvironment.camera.position.z = newPosition.z
      //renderingEnvironment.camera.rotation.x = vehicle.angles.z-Math.PI/2.0;
      renderingEnvironment.camera.up = new THREE.Vector3(0,  0, 1);
      renderingEnvironment.camera.lookAt(new THREE.Vector3(carPosition.position.x, carPosition.position.y, carPosition.position.z));
    } else {
      // attach the scene camera to car
      carGeometry.add(renderingEnvironment.camera) ;
    	renderingEnvironment.camera.position.x = 0.0 ;
    	renderingEnvironment.camera.position.z = 10.0 ;
    	renderingEnvironment.camera.position.y = -25.0 ;
    	renderingEnvironment.camera.rotation.x = 85.0*3.14159/180.0 ;
      renderingEnvironment.camera.rotation.y = 0.0 ;
      renderingEnvironment.camera.rotation.z = 0.0 ;
    }
    return renderingEnvironment.camera
  }
}
