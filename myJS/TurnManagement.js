TurnManagement = function() {

  this.lastActive = 0;
  finishedRace = false;
  var wrongDir = false;
  var begin = false;

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
      color: "#ff0000",
      lo: 0,
      hi: 1
    }, {
      color: "#00ff00",
      lo: 2,
      hi: 3
    }, {
      color: "#ff0000",
      lo: 1,
      hi: 2
    }]
  }

  this.turnCheckPoints = [{
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
  this.lastTurn = 0;
  this.turnMax = 3;

  var lapsTimes = [];
  var startLapTime ;

  var elapsedTime;


  this.turnCounter = new JustGage({
    id: 'turncounter',
    value: this.numberOfTurn,
    title: '',
    defaults: this.dflt
  });

  this.CheckpointPassed = function(NAV, carPosition) {
    var active = NAV.findActive(carPosition.position.x, carPosition.position.y);
    if (this.lastActive > parseInt(active)) {
      wrongDir = true;
    } else {
      wrongDir = false;
      this.lastActive = parseInt(active)
    }
    if(this.lastActive === 29 && parseInt(active) ===0 ){
      wrongDir = false;
      this.lastActive = parseInt(active)
    }

    var plane = NAV.planeSet[active];
    for (var c of this.turnCheckPoints) {
      if (c.plane === plane.name) {
        c.passed = true
        break
      }
    }
  }

  this.begin = function(){
    startLapTime = (new Date()).getTime();
    begin = true;
  }

  this.switchTurn = function() {
    var turnChecked = true;
    for (var p of this.turnCheckPoints) {
      if (p.passed === false) {
        turnChecked = false;
        break
      }
    }
    return turnChecked
  }

  this.isFinishedRace = function (){
    return finishedRace;
  }

  this.resetCheckPoints = function (){
    for (var c of this.turnCheckPoints) {
      c.passed = false
    }
  }

  this.countTurn = function(NAV, carPosition) {
    if (this.switchTurn() === true && this.passedArrived(NAV, carPosition) === true) {
      var now = (new Date()).getTime();
      lapsTimes.push((now - startLapTime) / 1000);
      startLapTime = now;
      this.numberOfTurn++;
      if (this.numberOfTurn === this.turnMax) {
        finishedRace = true;
      }
      this.resetCheckPoints();
    }
  }

  this.passedArrived = function(NAV, carPosition) {
    var passedArrived = false;
    var active = NAV.findActive(carPosition.position.x, carPosition.position.y);
    var plane = NAV.planeSet[active];
    if(lastPlane.plane !== plane.name){
      this.turnCheckPoints.forEach((c) => {
        if(c.plane === plane.name){
          c.passed = true
          lastPlane = c;
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
     //this.turnCounter.refresh(turn)
   }

    if ((plane.ymin) === 120) {
      passedArrived = true;
    }
    return passedArrived;
  }

  this.updateTurnCounter = function() {
    if (this.lastTurn !== this.numberOfTurn) {
      this.turnCounter.refresh(this.numberOfTurn)
      this.lastTurn = this.numberOfTurn
    }
  }

  this.resetCheckPoints = function (){
    for (var c of this.turnCheckPoints) {
      c.passed = false
    }
  }

  this.reset = function() {
    this.numberOfTurn = 0;
    lapsTimes = [];
    finishedRace = false;
    this.turnCounter.refresh(this.numberOfTurn)
    this.resetCheckPoints();
    document.getElementById("lap1").innerHTML = "";
    document.getElementById("lap2").innerHTML = "";
    document.getElementById("lap3").innerHTML = "";
    document.getElementById("elapsedTime").innerHTML = "";
    document.getElementById("wrongtext").innerHTML = "";
  }

  setInterval(function() {
    if(begin === true){
      elapsedTime = Math.round(((new Date()).getTime() - startLapTime) / 10) / 100;
      document.getElementById("elapsedTime").innerHTML = "Temps: "  + elapsedTime;
      var index = 0;
      for (var lap of lapsTimes) {
        document.getElementById("lap" + (index + 1)).innerHTML = "Tour " + parseInt(index + 1) + ": " + lap
        index++
      }
      if (wrongDir === true) {
        document.getElementById("wrongtext").innerHTML = "Mauvaise Direction";
      }
      else {
        document.getElementById("wrongtext").innerHTML = "";
      }
      if(finishedRace === true){
        document.getElementById("wrongtext").innerHTML = ""
        document.getElementById("finishedtext").innerHTML = "Course Terminée";
        document.getElementById("elapsedTime").innerHTML = "";
      }
      else {
        document.getElementById("finishedtext").innerHTML = "";
      }
    }
  }, 30);
}
