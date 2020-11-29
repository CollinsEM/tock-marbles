var msgCount = 0;

var numPlayers = 4;
var numTeams = 2;
var numMarblesPerPlayer = 4;
var numMarbles = numMarblesPerPlayer * numPlayers;
var numPositions = numPlayers*(18+2*numMarblesPerPlayer);

class Marble {
  constructor(idx) {
    this.idx = idx;
    this.pos = idx;
  }
};

class Player {
  constructor() {
    
  }
};

class Team {
  constructor() {
  }
};

class Board {
  constructor(nPlayers) {
    this.numPlayers = nPlayers;
    this.numPositions = nPlayers*18;
  }
};

init();

function init() {
  var msg = { nodes: [] };
  console.log("WORKER >> " + msg.nodes);
  postMessage(msg);
  // msgCount++;
  // if (msgCount < 10) {
  //   setTimeout("timedCount()", 1000);
  // }
}

self.addEventListener('message', onMessage, false);

function onMessage(e) {
  console.log("WORKER << ", e.data);
  var obj = e.data;
  Object.keys(obj).forEach( function(k) { console.log(k) }, this );
  msgCount = 0;
  timedCount();
}

function timedCount() {
  var N = parseInt(4*nPlayers);
  var nodes = [];
  for (var i=0; i<N; ++i) {
    nodes.push(parseInt(N*Math.random()));
  }
  var msg = { nodes: nodes };
  console.log("WORKER >> " + msg.nodes);
  postMessage(msg);
  msgCount++;
  if (msgCount < 10) {
    setTimeout("timedCount()", 1000);
  }
}
