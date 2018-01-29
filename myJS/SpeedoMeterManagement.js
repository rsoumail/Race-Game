

SpeedoMeterManagement = function(){

  this.dflt = {
    min: 0,
    max: 220,
    label: "Km/h",
    pointer: true,
    donut: false,
    gaugeWidthScale: 1.5,
    counter: true,
    hideInnerShadow: true,
    shadowSize: 5,
    customSectors: [{
      color : "#00ff00",
      lo : 0,
      hi : 80
    },{
      color : "#ff0000",
      lo : 160,
      hi : 220
    }]
  }

  this.speedoMeter = new JustGage({
    id: 'speedometer',
    value: 0,
    title: '',
    defaults: this.dflt
  });



  console.log("Speed " + this.speedoMeter.config.value)
  var i = 0;

  this.updateSpeedometer = function(speed){
    i++
    this.speedoMeter.refresh(i)
  }
}
