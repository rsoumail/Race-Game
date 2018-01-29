TurnManagement = function() {


  this.dflt = {
    min: 0,
    max: 3,
    label: "Tour(s)",
    donut: true,
    gaugeWidthScale: 0.8,
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




  this.turnCheckPoints = [
    {
      passed: false,
      plane: 'p02'
    },
    {
      passed: false,
      plane: 'p07'
    },
    {
      passed: false,
      plane: 'p14'
    },
    {
      passed: false,
      plane: 'p20'
    },
    {
      passed: false,
      plane: 'p27'
    },
    {
      passed: false,
      plane: 'p30'
    },
    {
      passed: false,
      plane: 'p01'
    }
  ]

  this.numberOfTurn = 0;
  var turnMax = 2;
  var lastPlane = {
    passed:'',
    plane:''
  };

  this.turnCounter = new JustGage({
    id: 'turncounter',
    value: this.numberOfTurn,
    title: '',
    defaults: this.dflt
  });
  this.CheckpointPassed = function(NAV, carPosition){
    var active = NAV.findActive(carPosition.position.x, carPosition.position.y);
    var plane = NAV.planeSet[active];
    if(lastPlane.plane !== plane.name){
      this.turnCheckPoints.forEach((c) => {
        if(c.plane === plane.name){
          c.passed = true
          lastPlane = c;
          console.log(plane.name + ' Passed ')
        }
      })
    }
  }

  this.switchTurn = function(){
      var turnChecked = true;
      this.turnCheckPoints.forEach((p) => {
        if(p.passed === false){
          turnChecked = false;
        }
      })
      return turnChecked
   }

   this.countTurn = function(NAV, carPosition){
      if(this.switchTurn() === true && this.passedArrived(NAV, carPosition) === true){
          this.numberOfTurn++

          console.log('Turn '  + this.numberOfTurn)
          if(this.numberOfTurn === turnMax){
            console.log('FIN')

          }
      this.turnCheckPoints.forEach((c) => {
          c.passed = false
       })
     }
     this.updateTurnCounter(this.numberOfTurn)
   }

   this.passedArrived = function(NAV, carPosition){
     var passedArrived = false;
     var active = NAV.findActive(carPosition.position.x, carPosition.position.y);
     var plane = NAV.planeSet[active];
     //console.log('logggg ' + plane.ymin)
     if((plane.ymin) === 120){
       passedArrived = true;
     }
     return passedArrived;
   }

   this.updateTurnCounter = function(turn){
     this.turnCounter.refresh(turn)
   }
}
