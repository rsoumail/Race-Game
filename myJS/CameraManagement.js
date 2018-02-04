CameraManagement = function() {

  this.currentCam = {};
  this.currentCamIndex = 0;


  this.cameraOfPlane = {
    30: 0,
    1: 0,
    2: 0,
    3: 1,
    4: 1,
    5: 1,
    6: 1,
    7: 2,
    8: 2,
    9: 2,
    10: 2,
    11: 3,
    12: 3,
    13: 3,
    14: 3,
    15: 4,
    16: 4,
    17: 4,
    18: 4,
    19: 4,
    20: 5,
    21: 5,
    22: 5,
    23: 5,
    24: 5,
    25: 6,
    26: 6,
    27: 6,
    28: 6,
    29: 6
  };

  this.camerasPositions = [{
      camera: new THREE.Vector3(-260, -160, 100),
      positions: ['p01', 'p02', 'p03']
    },
    {
      camera: new THREE.Vector3(-240, 260, 100),
      positions: ['p04', 'p05', 'p06']
    },
    {
      camera: new THREE.Vector3(40, 260, 100),
      positions: ['p07', 'p08']
    },
    {
      camera: new THREE.Vector3(20, 60, 100),
      positions: ['p09', 'p11', 'p10']
    },
    {
      camera: new THREE.Vector3(240, 80, 100),
      positions: ['p12', 'p13', 'p14']
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
      positions: ['p23', 'p24', 'p25']
    },
    {
      camera: new THREE.Vector3(-100, -240, 100),
      positions: ['p26', 'p27', 'p28']
    },
    {
      camera: new THREE.Vector3(-240, -240, 100),
      positions: ['p29', 'p30']
    }
  ];

  this.cameras = {

    embedded: {
      load: function(arg) {
        arg.carGeometry.add(arg.renderingEnvironment.camera);
        this.camerasPositions
        arg.renderingEnvironment.camera.position.x = 0;
        arg.renderingEnvironment.camera.position.z = 10;
        arg.renderingEnvironment.camera.position.y = -25;
        arg.renderingEnvironment.camera.rotation.x = Math.PI * (85 / 180);
        arg.renderingEnvironment.camera.rotation.y = 0;
        arg.renderingEnvironment.camera.rotation.z = 0;
      },
      unload: function(arg) {
        arg.carGeometry.remove(arg.renderingEnvironment.camera);
      }
    },

    fix: {
      render: function(arg) {
        var active = arg.NAV.findActive(arg.carPosition.position.x, arg.carPosition.position.y);
        active = parseInt(active) + 1
        var cameraPosition = this.camerasPositions[this.cameraOfPlane[active]].camera;
        arg.renderingEnvironment.camera.position.x = cameraPosition.x;
        arg.renderingEnvironment.camera.position.y = cameraPosition.y;
        arg.renderingEnvironment.camera.position.z = cameraPosition.z;
        // Set the rotation of the camera so it look at the car.
        arg.renderingEnvironment.camera.up = new THREE.Vector3(0, 0, 1);
        arg.renderingEnvironment.camera.lookAt(arg.NAV);

        return arg.renderingEnvironment.camera
      }
    },

    master: {
      load: function(arg) {
        arg.renderingEnvironment.camera.position.x = 0;
        arg.renderingEnvironment.camera.position.y = 0;
        arg.renderingEnvironment.camera.position.z = 460;
        arg.renderingEnvironment.camera.rotation.x = 0;
        arg.renderingEnvironment.camera.rotation.y = 0;
        arg.renderingEnvironment.camera.rotation.z = 0;
      }
    },

    helicopter: {
      load: function(arg) {
        arg.helicopter.position.add(arg.renderingEnvironment.camera);
        arg.renderingEnvironment.camera.position.x = 0;
        arg.renderingEnvironment.camera.position.y = -40;
        arg.renderingEnvironment.camera.position.z = 40;
        arg.renderingEnvironment.camera.rotation.x = Math.PI * (45 / 180);
        arg.renderingEnvironment.camera.rotation.y = 0;
        arg.renderingEnvironment.camera.rotation.z = 0;
      },
      unload: function(arg) {
        arg.helicopter.position.remove(arg.renderingEnvironment.camera);

      }
    },
  };



  this.switchCamera = function(arg) {
    if (this.currentCam.unload) {
      this.currentCam.unload(arg);
    }
    // Change camera
    var nbCamera = Object.keys(this.cameras).length;
    this.currentCamIndex = (this.currentCamIndex + 1) % nbCamera;
    this.currentCam = this.cameras[Object.keys(this.cameras)[this.currentCamIndex]];
    // Load new camera
    if (this.currentCam.load) {
      this.currentCam.load(arg)
    }
    // Set render of new camera
    if (this.currentCam.render) {
      this.render = this.currentCam.render;
    } else {
      this.render = function(arg) {
        return arg.renderingEnvironment.camera
      };
    }
  }


  this.render = function(arg) {
    return arg.renderingEnvironment.camera
  };
}
