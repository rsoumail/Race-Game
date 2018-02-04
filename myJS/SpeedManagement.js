SpeedManagement = function() {

  var speed = 0;
  var lastSpeed = 0;
  this.KMH_COEF = 50;

  this.oldPosition = new THREE.Vector3();
  this.currentPosition = new THREE.Vector3();
  this.dflt = {
    min: 0,
    max: 150,
    label: "Km/h",
    pointer: true,
    donut: false,
    gaugeWidthScale: 1.5,
    counter: true,
    hideInnerShadow: true,
    shadowSize: 5,
    customSectors: [{
      color: "#00ff00",
      lo: 0,
      hi: 50
    }, {
      color: "#ff0000",
      lo: 100,
      hi: 150
    }]
  }

  var $speedoMeter = new JustGage({
    id: 'speedometer',
    value: speed,
    title: '',
    defaults: this.dflt
  });



  var $updateSpeedoMeter = function() {
    $speedoMeter.refresh(speed)
  }

  this.updateSpeed = function(oldPosition, newPosition) {

    if (newPosition.x !== oldPosition.x && newPosition.y !== oldPosition.y) {
      var distance = this.getDistance(oldPosition, newPosition)
      if (distance !== 0) {
        speed = Math.floor(distance / 100.0 * this.KMH_COEF);
      }
    }
  }

  this.getDistance = function(v1, v2) {

    var dx = v2.x - v1.x;
    var dy = v2.y - v1.y;
    //var dz = v2.z - v1.z;

    return Math.sqrt(dx * dx + dy * dy /*+ dz * dz*/ );
  }

  this.reset = function (){
    var speed = 0;
    var lastSpeed = 0;
    $updateSpeedoMeter();
  }

  setInterval(function() {
    $updateSpeedoMeter()
  }, 300);
}
