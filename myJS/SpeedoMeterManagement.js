

SpeedoMeterManagement = function(){

  this.dflt = {
    min: 0,
    max: 220,
    symbol: ' Km/h',
    pointer: true,
    donut: false,
    gaugeWidthScale: 0.6,
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

  this.speedoMeter1 = new JustGage({
    id: 'turncounter',
    value: 0,
    title: '',
    defaults: this.dflt
  });

  console.log("Speed " + this.speedoMeter.config.value)
  var i = 0;

  this.updateSpeedometer = function(speed){
    console.log("Speed " + speed.length())
    console.log("Speed " + this.speedoMeter.config.value)
    i++
    this.speedoMeter.refresh(i)
  }
}
